import { NextResponse, type NextRequest } from "next/server";

import {
  retrieveStripeSubscription,
  verifyStripeWebhookSignature,
} from "@/lib/stripe/api";
import { getStripeConfig } from "@/lib/stripe/config";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

type StripeEventObject = {
  id?: string;
  customer?: string | { id?: string };
  subscription?: string;
  status?: string;
  current_period_end?: number;
  metadata?: {
    supplier_id?: string;
    owner_id?: string;
  };
};

type StripeSyncRpcClient = {
  rpc: (
    functionName: "sync_supplier_stripe_subscription",
    args: {
      p_webhook_secret: string;
      p_supplier_id: string;
      p_stripe_customer_id: string;
      p_stripe_subscription_id: string;
      p_stripe_status: string;
      p_current_period_end: string | null;
    },
  ) => Promise<{ error: { message: string } | null }>;
};

function getStripeId(value: string | { id?: string } | undefined) {
  return typeof value === "string" ? value : (value?.id ?? "");
}

function getPeriodEnd(value: number | undefined) {
  return value ? new Date(value * 1000).toISOString() : null;
}

async function syncSubscription(input: {
  webhookSecret: string;
  supplierId?: string;
  customerId?: string;
  subscriptionId?: string;
  status?: string;
  currentPeriodEnd?: number;
}) {
  if (!input.supplierId || !input.subscriptionId || !input.status) {
    throw new Error("Stripe subscription event is missing supplier metadata.");
  }

  const supabase =
    (await createServerSupabaseClient()) as unknown as StripeSyncRpcClient;
  const { error } = await supabase.rpc("sync_supplier_stripe_subscription", {
    p_webhook_secret: input.webhookSecret,
    p_supplier_id: input.supplierId,
    p_stripe_customer_id: input.customerId ?? "",
    p_stripe_subscription_id: input.subscriptionId,
    p_stripe_status: input.status,
    p_current_period_end: getPeriodEnd(input.currentPeriodEnd),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function POST(request: NextRequest) {
  const config = getStripeConfig();
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  if (!config.webhookSecret) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Stripe webhook secret is not configured." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      received: true,
      mode: "placeholder",
      message:
        "Stripe webhook received in placeholder mode. Configure STRIPE_WEBHOOK_SECRET before verifying live events.",
    });
  }

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature header." },
      { status: 400 },
    );
  }

  if (
    !verifyStripeWebhookSignature({
      payload,
      signature,
      secret: config.webhookSecret,
    })
  ) {
    return NextResponse.json(
      { error: "Invalid Stripe signature." },
      { status: 400 },
    );
  }

  let event: {
    type: string;
    data: {
      object: StripeEventObject;
    };
  };

  try {
    event = JSON.parse(payload) as typeof event;
  } catch {
    return NextResponse.json(
      { error: "Invalid Stripe webhook payload." },
      { status: 400 },
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      if (session.subscription) {
        const subscription = await retrieveStripeSubscription(
          session.subscription,
        );

        await syncSubscription({
          webhookSecret: config.webhookSecret,
          supplierId:
            session.metadata?.supplier_id ?? subscription.metadata?.supplier_id,
          customerId: getStripeId(session.customer ?? subscription.customer),
          subscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
        });
      }
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object;

      await syncSubscription({
        webhookSecret: config.webhookSecret,
        supplierId: subscription.metadata?.supplier_id,
        customerId: getStripeId(subscription.customer),
        subscriptionId: subscription.id,
        status:
          event.type === "customer.subscription.deleted"
            ? "canceled"
            : subscription.status,
        currentPeriodEnd: subscription.current_period_end,
      });
    }
  } catch (error) {
    console.error(
      "Unable to process Stripe webhook",
      error instanceof Error ? error.message : error,
    );

    return NextResponse.json(
      { error: "Unable to process Stripe webhook." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    received: true,
    mode: "verified",
    message: "Stripe webhook verified and processed.",
  });
}
