import { NextResponse, type NextRequest } from "next/server";

import { isStripeServerConfigured } from "@/lib/stripe/config";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin") ?? request.nextUrl.origin;

  if (!isStripeServerConfigured()) {
    return NextResponse.json({
      mode: "placeholder",
      url: `${origin}/dashboard/settings/verification?checkout=placeholder`,
      message:
        "Stripe checkout is ready to connect once STRIPE_SECRET_KEY is configured.",
    });
  }

  return NextResponse.json({
    mode: "stripe-ready",
    url: `${origin}/dashboard/settings/verification?checkout=stripe-ready`,
    message:
      "Install and initialize the Stripe SDK here to create a live Checkout Session.",
  });
}
