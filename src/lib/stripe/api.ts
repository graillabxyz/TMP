import {
  isExpectedAnnualCoupon,
  isExpectedVerificationPrice,
  type MembershipPlan,
} from "@/lib/marketplace-config";
import { getStripeConfig } from "@/lib/stripe/config";

const STRIPE_API_BASE = "https://api.stripe.com/v1";

type StripeCheckoutSessionResponse = {
  id: string;
  url: string | null;
};

type StripePortalSessionResponse = {
  id: string;
  url: string;
};

type StripeSubscriptionResponse = {
  id: string;
  status: string;
  current_period_end?: number;
  metadata?: {
    supplier_id?: string;
    owner_id?: string;
  };
  customer?: string | { id?: string };
};

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
}) {
  const { verificationPriceId, annualPriceId, annualCouponId } =
    getStripeConfig();
  const plan = input.plan ?? "monthly";
  const priceId = plan === "annual" ? annualPriceId : verificationPriceId;

  if (!priceId) {
    throw new Error("Missing configured membership price.");
  }

  const price = await assertVerificationPrice(priceId, plan);
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
    "subscription_data[metadata][supplier_id]": input.supplierId,
    "subscription_data[metadata][owner_id]": input.ownerId,
    "subscription_data[metadata][membership_plan]": plan,
  });

  if (annualOffer) body.set("discounts[0][coupon]", annualCouponId);

  if (input.customerId) {
    body.set("customer", input.customerId);
  } else if (input.customerEmail) {
    body.set("customer_email", input.customerEmail);
  }

  return stripeRequest<StripeCheckoutSessionResponse>("/checkout/sessions", {
    method: "POST",
    body,
  });
}

export async function createBillingPortalSession(input: {
  origin: string;
  returnPath: string;
  customerId: string;
}) {
  return stripeRequest<StripePortalSessionResponse>(
    "/billing_portal/sessions",
    {
      method: "POST",
      body: new URLSearchParams({
        customer: input.customerId,
        return_url: `${input.origin}${input.returnPath}`,
      }),
    },
  );
}

export async function retrieveStripeSubscription(subscriptionId: string) {
  return stripeRequest<StripeSubscriptionResponse>(
    `/subscriptions/${subscriptionId}`,
    {
      method: "GET",
    },
  );
}
