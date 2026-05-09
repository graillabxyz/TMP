import { NextResponse, type NextRequest } from "next/server";

import { getStripeConfig } from "@/lib/stripe/config";

export async function POST(request: NextRequest) {
  const config = getStripeConfig();
  const signature = request.headers.get("stripe-signature");

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

  await request.text();

  return NextResponse.json({
    received: true,
    mode: "stripe-ready",
    message:
      "Verify the Stripe event signature here, then update supplier subscription fields from checkout and invoice events.",
  });
}
