import { NextResponse, type NextRequest } from "next/server";

import {
  retrieveStripeSubscription,
  verifyStripeWebhookSignature,
} from "@/lib/stripe/api";
import { getStripeConfig } from "@/lib/stripe/config";

export async function POST(request: NextRequest) {
  const config = getStripeConfig();
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  if (!config.webhookSecret) {
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

  const event = JSON.parse(payload) as {
    type: string;
    data: {
      object: {
        id?: string;
        customer?: string;
        subscription?: string;
        metadata?: {
          supplier_id?: string;
          owner_id?: string;
        };
      };
    };
  };

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (session.subscription) {
      const subscription = await retrieveStripeSubscription(
        session.subscription,
      );

      console.info("Stripe verification subscription completed", {
        supplierId: session.metadata?.supplier_id,
        customerId: session.customer,
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
      });
    }
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    console.info("Stripe verification subscription changed", {
      subscriptionId: event.data.object.id,
      supplierId: event.data.object.metadata?.supplier_id,
      status: event.type,
    });
  }

  return NextResponse.json({
    received: true,
    mode: "verified",
    message:
      "Stripe webhook verified. Subscription database sync requires a secure Supabase write path.",
  });
}
