import { NextResponse, type NextRequest } from "next/server";

import { getAppOrigin, isAllowedAppOrigin } from "@/lib/app-url";
import { createBillingPortalSession } from "@/lib/stripe/api";
import { isStripeServerConfigured } from "@/lib/stripe/config";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PortalSupplierRow = {
  stripe_customer_id: string | null;
};

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
      url: `${origin}/dashboard/settings/verification?portal=placeholder`,
      message:
        "Stripe customer portal is ready to connect once STRIPE_SECRET_KEY and STRIPE_VERIFICATION_PRICE_ID are configured.",
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
        url: `${origin}/login?next=/dashboard/profile`,
      });
    }

    const { data: supplierData, error } = await supabase
      .from("suppliers")
      .select("stripe_customer_id")
      .eq("owner_id", user.id)
      .maybeSingle();
    const supplier = supplierData as unknown as PortalSupplierRow | null;

    if (error || !supplier?.stripe_customer_id) {
      return NextResponse.json({
        mode: "customer-required",
        url: `${origin}/dashboard/settings/verification?portal=missing-customer`,
        message:
          error?.message ??
          "Start a verification subscription before opening the customer portal.",
      });
    }

    const session = await createBillingPortalSession({
      origin,
      customerId: supplier.stripe_customer_id,
    });

    return NextResponse.json({
      mode: "portal",
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Unable to create Stripe customer portal session", error);

    return NextResponse.json(
      {
        mode: "error",
        url: `${origin}/dashboard/settings/verification?portal=error`,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create portal session.",
      },
      { status: 500 },
    );
  }
}
