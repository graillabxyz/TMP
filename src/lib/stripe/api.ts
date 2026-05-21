import { createHmac, timingSafeEqual } from "node:crypto";

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
  customer?: string;
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

export async function createVerificationCheckoutSession(input: {
  origin: string;
  supplierId: string;
  ownerId: string;
  customerId?: string | null;
  customerEmail?: string | null;
}) {
  const { verificationPriceId } = getStripeConfig();

  if (!verificationPriceId) {
    throw new Error("Missing STRIPE_VERIFICATION_PRICE_ID.");
  }

  const body = new URLSearchParams({
    mode: "subscription",
    success_url:
      `${input.origin}/dashboard/settings/verification` +
      "?checkout=success&session_id={CHECKOUT_SESSION_ID}",
    cancel_url: `${input.origin}/dashboard/settings/verification?checkout=cancelled`,
    client_reference_id: input.supplierId,
    "line_items[0][price]": verificationPriceId,
    "line_items[0][quantity]": "1",
    "metadata[supplier_id]": input.supplierId,
    "metadata[owner_id]": input.ownerId,
    "subscription_data[metadata][supplier_id]": input.supplierId,
    "subscription_data[metadata][owner_id]": input.ownerId,
    allow_promotion_codes: "true",
  });

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
  customerId: string;
}) {
  return stripeRequest<StripePortalSessionResponse>("/billing_portal/sessions", {
    method: "POST",
    body: new URLSearchParams({
      customer: input.customerId,
      return_url: `${input.origin}/dashboard/settings/verification`,
    }),
  });
}

export async function retrieveStripeSubscription(subscriptionId: string) {
  return stripeRequest<StripeSubscriptionResponse>(
    `/subscriptions/${subscriptionId}`,
    {
      method: "GET",
    },
  );
}

export function verifyStripeWebhookSignature(input: {
  payload: string;
  signature: string;
  secret: string;
}) {
  const parts = input.signature.split(",").reduce<Record<string, string[]>>(
    (acc, item) => {
      const [key, value] = item.split("=");

      if (key && value) {
        acc[key] = [...(acc[key] ?? []), value];
      }

      return acc;
    },
    {},
  );
  const timestamp = parts.t?.[0];
  const signatures = parts.v1 ?? [];

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const expected = createHmac("sha256", input.secret)
    .update(`${timestamp}.${input.payload}`)
    .digest("hex");

  return signatures.some((signature) => {
    const expectedBuffer = Buffer.from(expected, "hex");
    const signatureBuffer = Buffer.from(signature, "hex");

    return (
      expectedBuffer.length === signatureBuffer.length &&
      timingSafeEqual(expectedBuffer, signatureBuffer)
    );
  });
}
