import { NextResponse, type NextRequest } from "next/server";

import { isStripeServerConfigured } from "@/lib/stripe/config";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin") ?? request.nextUrl.origin;

  if (!isStripeServerConfigured()) {
    return NextResponse.json({
      mode: "placeholder",
      url: `${origin}/dashboard/settings/verification?portal=placeholder`,
      message:
        "Stripe customer portal is ready to connect once STRIPE_SECRET_KEY is configured.",
    });
  }

  return NextResponse.json({
    mode: "stripe-ready",
    url: `${origin}/dashboard/settings/verification?portal=stripe-ready`,
    message:
      "Install and initialize the Stripe SDK here to create a live Billing Portal Session.",
  });
}
