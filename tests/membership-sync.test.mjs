import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { registerHooks } from "node:module";
import test from "node:test";
import {
  getMembershipDetails,
  blocksNewSubscription,
} from "../src/lib/stripe/membership.ts";

const adminMock =
  "data:text/javascript," +
  encodeURIComponent(
    "export function createAdminSupabaseClient() { return globalThis.billingTestDb; }",
  );
registerHooks({
  resolve(s, c, n) {
    return n(
      s === "@/lib/supabase/admin"
        ? adminMock
        : s === "next/server"
          ? "next/server.js"
          : s.startsWith("@/")
            ? new URL(`../src/${s.slice(2)}.ts`, import.meta.url).href
            : s,
      c,
    );
  },
});
const { POST } = await import("../src/app/api/stripe/webhook/route.ts");
const prices = {
  verificationPriceId: "price_month",
  annualPriceId: "price_year",
};
function subscription(overrides = {}) {
  return {
    id: "sub_current",
    status: "active",
    customer: "cus_example",
    metadata: { supplier_id: "supplier", owner_id: "owner" },
    items: {
      data: [
        {
          quantity: 1,
          current_period_end: 1800000000,
          price: {
            id: "price_year",
            currency: "eur",
            unit_amount: 60000,
            recurring: { interval: "year", interval_count: 1 },
          },
        },
      ],
    },
    ...overrides,
  };
}

test("membership periods support Stripe item-level and legacy fields; trials do not grant paid access", () => {
  const s = subscription();
  assert.equal(getMembershipDetails(s, prices).periodEnd, 1800000000);
  assert.equal(
    getMembershipDetails({ ...s, status: "trialing" }, prices).accessStatus,
    "inactive",
  );
  assert.equal(
    getMembershipDetails({ ...s, cancel_at_period_end: true }, prices)
      .canceling,
    true,
  );
  delete s.items.data[0].current_period_end;
  assert.equal(
    getMembershipDetails({ ...s, current_period_end: 1800000001 }, prices)
      .periodEnd,
    1800000001,
  );
  assert.equal(getMembershipDetails(s, prices), null);
  for (const status of [
    "active",
    "past_due",
    "unpaid",
    "incomplete",
    "paused",
    "trialing",
  ])
    assert.equal(blocksNewSubscription(status), true);
  for (const status of ["canceled", "incomplete_expired"])
    assert.equal(blocksNewSubscription(status), false);
});

test("membership validation rejects foreign prices, extra seats, incorrect currency and multiple items", () => {
  for (const change of [
    { quantity: 2 },
    { price: { id: "price_foreign" } },
    { price: { ...subscription().items.data[0].price, currency: "usd" } },
  ]) {
    const s = subscription();
    Object.assign(s.items.data[0], change);
    assert.equal(getMembershipDetails(s, prices), null);
  }
  const s = subscription();
  s.items.data.push(s.items.data[0]);
  assert.equal(getMembershipDetails(s, prices), null);
});

function setup(t, sub, stored = {}) {
  process.env.STRIPE_SECRET_KEY = "test_key";
  process.env.STRIPE_WEBHOOK_SECRET = "test_secret";
  process.env.STRIPE_VERIFICATION_PRICE_ID = "price_month";
  process.env.STRIPE_ANNUAL_PRICE_ID = "price_year";
  const calls = [];
  globalThis.billingTestDb = {
    from() {
      const query = {
        select() {
          return query;
        },
        eq() {
          return query;
        },
        async single() {
          return {
            data: {
              owner_id: "owner",
              stripe_customer_id: "cus_example",
              stripe_subscription_id: "sub_current",
              ...stored,
            },
            error: null,
          };
        },
      };
      return query;
    },
    async rpc(name, args) {
      calls.push(args);
      return { error: null };
    },
  };
  t.mock.method(globalThis, "fetch", async (url) =>
    Response.json(
      String(url).endsWith("/sub_new") ? subscription({ id: "sub_new" }) : sub,
    ),
  );
  return calls;
}
function request(
  type = "customer.subscription.updated",
  object = { id: "sub_current" },
) {
  const created = Math.floor(Date.now() / 1000);
  const body = JSON.stringify({
    id: "evt_example",
    created,
    type,
    data: { object },
  });
  const sig = createHmac("sha256", "test_secret")
    .update(`${created}.${body}`)
    .digest("hex");
  return new Request("https://example.com/api/stripe/webhook", {
    method: "POST",
    body,
    headers: { "stripe-signature": `t=${created},v1=${sig}` },
  });
}
test("signed subscription creation activates only a validated membership with its actual paid-period end", async (t) => {
  const calls = setup(t, subscription());
  const r = await POST(request("customer.subscription.created"));
  assert.equal(r.status, 200);
  assert.equal(calls[0].p_stripe_status, "active");
  assert.equal(
    calls[0].p_current_period_end,
    new Date(1800000000000).toISOString(),
  );
});
test("delayed events use current canceled Stripe state instead of stale active payload", async (t) => {
  const calls = setup(t, subscription({ status: "canceled" }));
  await POST(
    request("customer.subscription.updated", {
      id: "sub_current",
      status: "active",
    }),
  );
  assert.equal(calls[0].p_stripe_status, "canceled");
});
test("payment failures remove active membership without losing its billing identity", async (t) => {
  const calls = setup(t, subscription({ status: "past_due" }));
  await POST(request());
  assert.equal(calls[0].p_stripe_status, "past_due");
  assert.equal(calls[0].p_stripe_customer_id, "cus_example");
});
test("wrong supplier owner cannot receive access", async (t) => {
  const calls = setup(t, subscription(), { owner_id: "another_owner" });
  assert.equal((await POST(request())).status, 500);
  assert.equal(calls.length, 0);
});
test("an old canceled subscription cannot overwrite a newer active subscription", async (t) => {
  const calls = setup(t, subscription({ status: "canceled" }), {
    stripe_subscription_id: "sub_new",
  });
  assert.equal((await POST(request())).status, 200);
  assert.equal(calls.length, 0);
});
test("changing an existing membership to an unsupported price revokes access", async (t) => {
  const s = subscription();
  s.items.data[0].price.id = "price_other";
  const calls = setup(t, s);
  await POST(request());
  assert.equal(calls[0].p_stripe_status, "inactive");
});
test("invalid signature and malformed signed event never update billing", async (t) => {
  const calls = setup(t, subscription());
  const r = await POST(
    new Request("https://example.com", { method: "POST", body: "{}" }),
  );
  assert.equal(r.status, 400);
  assert.equal(calls.length, 0);
});
