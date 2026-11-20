import {
  isExpectedAnnualCoupon,
  isExpectedVerificationPrice,
  type MembershipPlan,
} from "@/lib/marketplace-config";
import { getStripeConfig } from "@/lib/stripe/config";
import {
  blocksNewSubscription,
  type MembershipSubscription,
} from "@/lib/stripe/membership";

const STRIPE_API_BASE = "https://api.stripe.com/v1";

type StripeCheckoutSessionResponse = {
  id: string;
  url: string | null;
  status?: string;
  payment_status?: string;
  subscription?: string | null;
  customer?: string | null;
  metadata?: {
    supplier_id?: string;
    owner_id?: string;
    membership_plan?: string;
    annual_offer?: string;
  };
};

type StripePortalSessionResponse = {
  id: string;
  url: string;
};

type StripeSubscriptionResponse = MembershipSubscription;

type StripePriceResponse = {
  product: string;
  active: boolean;
  currency: string;
  unit_amount: number | null;
  recurring?: {
    interval?: string;
    interval_count?: number;
  } | null;
};

type StripeApiError = {
  error?: {
    message?: string;
  };
};

async function stripeRequest<T>(
  path: string,
  init: RequestInit & { body?: URLSearchParams },
) {
  const { secretKey } = getStripeConfig();

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY.");
  }

  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    ...init,
    cache: "no-store",
    signal: init.signal ?? AbortSignal.timeout(12000),
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...init.headers,
    },
  });
  const payload = (await response.json()) as T & StripeApiError;

  if (!response.ok) {
    throw new Error(payload.error?.message ?? "Stripe request failed.");
  }

  return payload;
}

export async function getOrCreateBillingCustomer(input: {
  supplierId: string;
  ownerId: string;
  email?: string | null;
  customerId?: string | null;
}) {
  if (input.customerId) return input.customerId;
  // Customer creation is idempotent while Stripe's metadata search index catches up.
  const query = new URLSearchParams({
    query: `metadata['supplier_id']:'${input.supplierId}' AND metadata['owner_id']:'${input.ownerId}'`,
    limit: "1",
  });
  const existing = await stripeRequest<{ data: Array<{ id: string }> }>(
    `/customers/search?${query}`,
    { method: "GET" },
  );
  if (existing.data[0]) return existing.data[0].id;
  const body = new URLSearchParams({
    "metadata[supplier_id]": input.supplierId,
    "metadata[owner_id]": input.ownerId,
  });
  if (input.email) body.set("email", input.email);
  const customer = await stripeRequest<{ id: string }>("/customers", {
    method: "POST",
    body,
    headers: {
      "Idempotency-Key": `tmp-customer-${input.supplierId}-${input.ownerId}`,
    },
  });
  return customer.id;
}

export async function getCustomerSubscriptions(customerId: string) {
  const rows: MembershipSubscription[] = [];
  let cursor = "";
  for (let page = 0; page < 20; page++) {
    const query = new URLSearchParams({
      customer: customerId,
      status: "all",
      limit: "100",
    });
    if (cursor) query.set("starting_after", cursor);
    const result = await stripeRequest<{
      data: MembershipSubscription[];
      has_more: boolean;
    }>(`/subscriptions?${query}`, { method: "GET" });
    rows.push(...result.data);
    if (!result.has_more) return rows;
    cursor = result.data.at(-1)?.id ?? "";
    if (!cursor) break;
  }
  throw new Error("Unable to verify subscription history.");
}

async function assertVerificationPrice(priceId: string, plan: MembershipPlan) {
  const price = await stripeRequest<StripePriceResponse>(
    `/prices/${encodeURIComponent(priceId)}`,
    { method: "GET" },
  );

  if (!isExpectedVerificationPrice(price, plan)) {
    throw new Error(`Invalid configured ${plan} membership price.`);
  }
  return price;
}

// Check all prior subscriptions so cancellation cannot restart the introductory year.
export async function isAnnualOfferEligible(customerId?: string | null) {
  if (!customerId) return true;
  let cursor = "";
  for (let page = 0; page < 20; page++) {
    const query = new URLSearchParams({
      customer: customerId,
      status: "all",
      limit: "100",
    });
    if (cursor) query.set("starting_after", cursor);
    const subscriptions = await stripeRequest<{
      data: Array<{
        id: string;
        status: string;
        metadata?: { membership_plan?: string };
        items: { data: Array<{ price: { id: string } }> };
      }>;
      has_more: boolean;
    }>(`/subscriptions?${query}`, { method: "GET", cache: "no-store" });
    if (
      subscriptions.data.some(
        (subscription) =>
          subscription.status !== "incomplete_expired" &&
          subscription.status !== "incomplete" &&
          (subscription.metadata?.membership_plan === "annual" ||
            subscription.items.data.some(
              (item) => item.price.id === getStripeConfig().annualPriceId,
            )),
      )
    )
      return false;
    if (!subscriptions.has_more) return true;
    cursor = subscriptions.data.at(-1)?.id ?? "";
    if (!cursor) break;
  }
  throw new Error("Unable to verify annual offer eligibility.");
}

export async function createVerificationCheckoutSession(input: {
  origin: string;
  returnPath: string;
  supplierId: string;
  ownerId: string;
  customerId?: string | null;
  customerEmail?: string | null;
  plan?: MembershipPlan;
  expectedAnnualOffer?: boolean;
  locale?: "en" | "fr" | "tr";
}) {
  const { verificationPriceId, annualPriceId, annualCouponId } =
    getStripeConfig();
  const plan = input.plan ?? "monthly";
  const priceId = plan === "annual" ? annualPriceId : verificationPriceId;

  if (!priceId) {
    throw new Error("Missing configured membership price.");
  }

  const price = await assertVerificationPrice(priceId, plan);
  if (!input.customerId) throw new Error("A billing customer is required.");
  const subscriptions = await getCustomerSubscriptions(input.customerId);
  if (subscriptions.some((sub) => blocksNewSubscription(sub.status))) {
    return createBillingPortalSession({
      origin: input.origin,
      returnPath: input.returnPath,
      customerId: input.customerId,
      locale: input.locale,
    });
  }
  const annualOffer =
    plan === "annual" && (await isAnnualOfferEligible(input.customerId));
  if (plan === "annual" && input.expectedAnnualOffer !== annualOffer) {
    throw new Error(
      "Annual offer eligibility changed. Reload before checkout.",
    );
  }
  if (annualOffer) {
    if (!annualCouponId) throw new Error("Missing annual offer coupon.");
    const coupon = await stripeRequest<
      Parameters<typeof isExpectedAnnualCoupon>[0]
    >(`/coupons/${encodeURIComponent(annualCouponId)}?expand[]=applies_to`, {
      method: "GET",
    });
    if (!isExpectedAnnualCoupon(coupon, price.product))
      throw new Error("Invalid annual offer coupon.");
  }

  const body = new URLSearchParams({
    mode: "subscription",
    success_url:
      `${input.origin}${input.returnPath}` +
      "?checkout=success&session_id={CHECKOUT_SESSION_ID}",
    cancel_url: `${input.origin}${input.returnPath}?checkout=cancelled`,
    client_reference_id: input.supplierId,
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    "metadata[supplier_id]": input.supplierId,
    "metadata[owner_id]": input.ownerId,
    "metadata[membership_plan]": plan,
    "metadata[annual_offer]": String(annualOffer),
    "subscription_data[metadata][supplier_id]": input.supplierId,
    "subscription_data[metadata][owner_id]": input.ownerId,
    "subscription_data[metadata][membership_plan]": plan,
    locale: input.locale ?? "en",
  });

  if (annualOffer) body.set("discounts[0][coupon]", annualCouponId);

  if (input.customerId) {
    body.set("customer", input.customerId);
  } else if (input.customerEmail) {
    body.set("customer_email", input.customerEmail);
  }

  const open = await stripeRequest<{
    data: StripeCheckoutSessionResponse[];
    has_more: boolean;
  }>(
    `/checkout/sessions?${new URLSearchParams({ customer: input.customerId, status: "open", limit: "100" })}`,
    { method: "GET" },
  );
  if (open.has_more) throw new Error("Too many open checkout sessions.");
  for (const session of open.data) {
    if (session.metadata?.supplier_id !== input.supplierId)
      throw new Error("Unexpected open checkout for this customer.");
    if (
      session.metadata?.membership_plan === plan &&
      session.metadata.annual_offer === String(annualOffer)
    )
      return session;
    // A different plan cannot remain payable in another tab. If it completed meanwhile, stop here.
    await stripeRequest(
      `/checkout/sessions/${encodeURIComponent(session.id)}/expire`,
      { method: "POST" },
    );
  }
  const recent = await stripeRequest<{ data: StripeCheckoutSessionResponse[] }>(
    `/checkout/sessions?${new URLSearchParams({ customer: input.customerId, limit: "1" })}`,
    { method: "GET" },
  );
  const latest = recent.data[0];
  // Another request may have opened or completed checkout after the first list call.
  if (
    latest?.status === "open" &&
    !open.data.some((session) => session.id === latest.id)
  ) {
    if (latest.metadata?.supplier_id !== input.supplierId)
      throw new Error("Unexpected checkout owner.");
    if (
      latest.metadata.membership_plan === plan &&
      latest.metadata.annual_offer === String(annualOffer)
    )
      return latest;
    await stripeRequest(
      `/checkout/sessions/${encodeURIComponent(latest.id)}/expire`,
      { method: "POST" },
    );
  }
  if (latest?.status === "complete" && latest.subscription) {
    const paid = await retrieveStripeSubscription(latest.subscription);
    if (blocksNewSubscription(paid.status))
      return createBillingPortalSession({
        origin: input.origin,
        returnPath: input.returnPath,
        customerId: input.customerId,
        locale: input.locale,
      });
  }
  return stripeRequest<StripeCheckoutSessionResponse>("/checkout/sessions", {
    method: "POST",
    body,
    headers: {
      "Idempotency-Key": `tmp-checkout-${input.supplierId}-${recent.data[0]?.id ?? "initial"}`,
    },
  });
}

export async function createBillingPortalSession(input: {
  origin: string;
  returnPath: string;
  customerId: string;
  locale?: "en" | "fr" | "tr";
}) {
  const { portalConfigurationId } = getStripeConfig();
  if (!portalConfigurationId)
    throw new Error("Billing portal is not configured.");
  return stripeRequest<StripePortalSessionResponse>(
    "/billing_portal/sessions",
    {
      method: "POST",
      body: new URLSearchParams({
        customer: input.customerId,
        return_url: `${input.origin}${input.returnPath}`,
        configuration: portalConfigurationId,
        locale: input.locale ?? "en",
      }),
    },
  );
}

export async function retrieveStripeSubscription(subscriptionId: string) {
  return stripeRequest<StripeSubscriptionResponse>(
    `/subscriptions/${encodeURIComponent(subscriptionId)}`,
    {
      method: "GET",
    },
  );
}

export async function retrieveCheckoutSession(id: string) {
  return stripeRequest<StripeCheckoutSessionResponse>(
    `/checkout/sessions/${encodeURIComponent(id)}`,
    { method: "GET" },
  );
}
