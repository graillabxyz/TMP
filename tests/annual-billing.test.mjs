import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";
import {
  isExpectedAnnualCoupon,
  isExpectedVerificationPrice,
} from "../src/lib/marketplace-config.ts";

registerHooks({
  resolve(specifier, context, next) {
    return next(
      specifier.startsWith("@/")
        ? new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href
        : specifier,
      context,
    );
  },
});
const { createVerificationCheckoutSession, isAnnualOfferEligible } =
  await import("../src/lib/stripe/api.ts");

const annualPrice = {
  active: true,
  product: "prod_member",
  currency: "eur",
  unit_amount: 60000,
  recurring: { interval: "year", interval_count: 1 },
};
const coupon = {
  valid: true,
  duration: "once",
  percent_off: 50,
  applies_to: { products: ["prod_member"] },
};
const input = {
  origin: "https://example.com",
  returnPath: "/fr/dashboard/settings/verification",
  supplierId: "supplier",
  ownerId: "owner",
  plan: "annual",
  expectedAnnualOffer: true,
  customerId: "cus_example",
};

function mockStripe(t, overrides = {}) {
  for (const [key, value] of Object.entries({
    STRIPE_SECRET_KEY: "test_key",
    STRIPE_VERIFICATION_PRICE_ID: "price_month",
    STRIPE_ANNUAL_PRICE_ID: "price_year",
    STRIPE_ANNUAL_COUPON_ID: "coupon_intro",
    STRIPE_PORTAL_CONFIGURATION_ID: "bpc_example",
  })) {
    const original = process.env[key];
    process.env[key] = value;
    t.after(() =>
      original === undefined
        ? delete process.env[key]
        : (process.env[key] = original),
    );
  }
  const requests = [];
  t.mock.method(globalThis, "fetch", async (url, init) => {
    requests.push({
      url: String(url),
      body: init.body,
      method: init.method,
      headers: init.headers,
    });
    const path = new URL(url).pathname;
    let value;
    if (path.endsWith("/price_year")) value = overrides.price ?? annualPrice;
    else if (path.endsWith("/price_month"))
      value = {
        ...annualPrice,
        unit_amount: 5000,
        recurring: { interval: "month", interval_count: 1 },
      };
    else if (path.includes("/coupons/")) {
      assert.equal(new URL(url).searchParams.get("expand[]"), "applies_to");
      value = overrides.coupon ?? coupon;
    } else if (path.endsWith("/subscriptions"))
      value =
        typeof overrides.history === "function"
          ? overrides.history(url)
          : { data: overrides.history ?? [], has_more: false };
    else if (path.endsWith("/checkout/sessions"))
      value =
        init.method === "GET"
          ? {
              data:
                typeof overrides.sessions === "function"
                  ? overrides.sessions(url)
                  : (overrides.sessions ?? []),
              has_more: false,
            }
          : { id: "cs_example", url: "https://checkout.stripe.com/example" };
    else if (path.endsWith("/expire")) value = { status: "expired" };
    else if (path.endsWith("/billing_portal/sessions"))
      value = { id: "bps_example", url: "https://billing.stripe.com/example" };
    else throw new Error(`Unexpected Stripe call: ${url}`);
    return Response.json(value);
  });
  return requests;
}

test("annual price and coupon guards reject wrong amounts, intervals and recurring discounts", () => {
  assert.equal(isExpectedVerificationPrice(annualPrice, "annual"), true);
  for (const changed of [
    { unit_amount: 30000 },
    { active: false },
    { currency: "usd" },
    { recurring: { interval: "month" } },
    { recurring: { interval: "year", interval_count: 2 } },
  ]) {
    assert.equal(
      isExpectedVerificationPrice({ ...annualPrice, ...changed }, "annual"),
      false,
    );
  }
  assert.equal(isExpectedAnnualCoupon(coupon, "prod_member"), true);
  for (const changed of [
    { duration: "forever" },
    { duration: "repeating" },
    { percent_off: 100 },
    { valid: false },
    { applies_to: { products: ["other"] } },
  ]) {
    assert.equal(
      isExpectedAnnualCoupon({ ...coupon, ...changed }, "prod_member"),
      false,
    );
  }
});

test("an existing Stripe subscription opens the portal even before the DB webhook catches up", async (t) => {
  const requests = mockStripe(t, {
    history: [{ id: "sub_active", status: "active", items: { data: [] } }],
  });
  await createVerificationCheckoutSession(input);
  assert.equal(requests.at(-1).body.get("configuration"), "bpc_example");
  assert.equal(
    requests.some(
      (r) => r.url.endsWith("/checkout/sessions") && r.method === "POST",
    ),
    false,
  );
});

test("same-plan retries reuse an open checkout and other plans expire before replacement", async (t) => {
  const session = {
    id: "cs_existing",
    status: "open",
    url: "https://checkout.stripe.com/existing",
    metadata: {
      supplier_id: "supplier",
      membership_plan: "annual",
      annual_offer: "true",
    },
  };
  const requests = mockStripe(t, { sessions: [session] });
  assert.equal(
    (await createVerificationCheckoutSession(input)).id,
    "cs_existing",
  );
  assert.equal(
    requests.some(
      (r) => r.url.endsWith("/checkout/sessions") && r.method === "POST",
    ),
    false,
  );
  await createVerificationCheckoutSession({
    ...input,
    plan: "monthly",
    locale: "fr",
  });
  assert.ok(requests.some((r) => r.url.endsWith("/cs_existing/expire")));
  assert.equal(
    requests.at(-1).headers["Idempotency-Key"],
    "tmp-checkout-supplier-cs_existing",
  );
  assert.equal(requests.at(-1).body.get("locale"), "fr");
});

test("a checkout opened between Stripe list calls is reused instead of duplicated", async (t) => {
  const session = {
    id: "cs_racing",
    status: "open",
    url: "https://checkout.stripe.com/racing",
    metadata: {
      supplier_id: "supplier",
      membership_plan: "annual",
      annual_offer: "true",
    },
  };
  const requests = mockStripe(t, {
    sessions: (url) =>
      new URL(url).searchParams.has("status") ? [] : [session],
  });
  assert.equal(
    (await createVerificationCheckoutSession(input)).id,
    "cs_racing",
  );
  assert.equal(
    requests.some((r) => r.method === "POST"),
    false,
  );
});

test("an unexpected checkout owner fails closed", async (t) => {
  const requests = mockStripe(t, {
    sessions: [
      { id: "cs_foreign", status: "open", metadata: { supplier_id: "other" } },
    ],
  });
  await assert.rejects(
    createVerificationCheckoutSession(input),
    /Unexpected open checkout/,
  );
  assert.equal(
    requests.some((r) => r.method === "POST"),
    false,
  );
});

test("first annual checkout is EUR 600 recurring with a single 50% discount and no trial", async (t) => {
  const requests = mockStripe(t);
  await createVerificationCheckoutSession(input);
  const body = requests.at(-1).body;
  assert.equal(body.get("line_items[0][price]"), "price_year");
  assert.equal(body.get("discounts[0][coupon]"), "coupon_intro");
  assert.equal(
    body.get("subscription_data[metadata][membership_plan]"),
    "annual",
  );
  assert.equal(body.has("allow_promotion_codes"), false);
  assert.equal(body.has("subscription_data[trial_period_days]"), false);
  assert.match(
    body.get("success_url"),
    /\/fr\/dashboard\/settings\/verification/,
  );
});

test("monthly checkout remains EUR 50 with no annual discount", async (t) => {
  const requests = mockStripe(t);
  await createVerificationCheckoutSession({ ...input, plan: "monthly" });
  assert.equal(requests.at(-1).body.get("line_items[0][price]"), "price_month");
  assert.equal(requests.at(-1).body.has("discounts[0][coupon]"), false);
});

test("returning annual customers must explicitly accept EUR 600 without the introductory discount", async (t) => {
  const requests = mockStripe(t, {
    history: [
      {
        id: "sub_previous",
        status: "canceled",
        metadata: { membership_plan: "annual" },
        items: { data: [] },
      },
    ],
  });
  await assert.rejects(
    createVerificationCheckoutSession({
      ...input,
      customerId: "cus_returning",
    }),
    /eligibility changed/,
  );
  assert.equal(
    requests.some((r) => r.url.endsWith("/checkout/sessions")),
    false,
  );
  await createVerificationCheckoutSession({
    ...input,
    customerId: "cus_returning",
    expectedAnnualOffer: false,
  });
  assert.equal(requests.at(-1).body.has("discounts[0][coupon]"), false);
});

test("eligibility checks older pages, ignores expired unpaid attempts, and permits prior monthly memberships", async (t) => {
  mockStripe(t, {
    history: (url) =>
      new URL(url).searchParams.has("starting_after")
        ? {
            data: [
              {
                id: "sub_old",
                status: "canceled",
                items: { data: [{ price: { id: "price_year" } }] },
              },
            ],
            has_more: false,
          }
        : {
            data: [
              {
                id: "sub_month",
                status: "canceled",
                items: { data: [{ price: { id: "price_month" } }] },
              },
              {
                id: "sub_unpaid",
                status: "incomplete_expired",
                metadata: { membership_plan: "annual" },
                items: { data: [] },
              },
            ],
            has_more: true,
          },
  });
  assert.equal(await isAnnualOfferEligible("cus_existing"), false);
  assert.equal(await isAnnualOfferEligible(null), true);
});

test("invalid coupon fails closed before creating checkout", async (t) => {
  const requests = mockStripe(t, {
    coupon: { ...coupon, duration: "forever" },
  });
  await assert.rejects(
    createVerificationCheckoutSession(input),
    /Invalid annual offer coupon/,
  );
  assert.equal(
    requests.some((r) => r.url.endsWith("/checkout/sessions")),
    false,
  );
});
