import { NextResponse, type NextRequest } from "next/server";

import { getAppOrigin, isAllowedAppOrigin } from "@/lib/app-url";
import { createVerificationCheckoutSession } from "@/lib/stripe/api";
import { isStripeServerConfigured } from "@/lib/stripe/config";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const origin = getAppOrigin(request.nextUrl.origin);

  if (
    !isAllowedAppOrigin(request.headers.get("origin"), request.nextUrl.origin)
  ) {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  }

  if (!isStripeServerConfigured()) {
    return NextResponse.json({
      mode: "placeholder",
      url: `${origin}/dashboard/settings/verification?checkout=placeholder`,
      message:
        "Stripe checkout is ready to connect once STRIPE_SECRET_KEY and STRIPE_VERIFICATION_PRICE_ID are configured.",
    });
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        mode: "auth-required",
        url: `${origin}/login?role=supplier`,
      });
    }

    const { data: supplier, error } = await supabase
      .from("suppliers")
      .select("id, owner_id, stripe_customer_id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (error || !supplier) {
      return NextResponse.json({
        mode: "supplier-required",
        url: `${origin}/dashboard/settings/verification?status=supplier-missing`,
        message: error?.message ?? "Supplier profile is required.",
      });
    }

    const session = await createVerificationCheckoutSession({
      origin,
      supplierId: supplier.id,
      ownerId: supplier.owner_id ?? user.id,
      customerId: supplier.stripe_customer_id,
      customerEmail: user.email,
    });

    return NextResponse.json({
      mode: "checkout",
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Unable to create Stripe checkout session", error);

    return NextResponse.json(
      {
        mode: "error",
        url: `${origin}/dashboard/settings/verification?checkout=error`,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create checkout session.",
      },
      { status: 500 },
    );
  }
}
