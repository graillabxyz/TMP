import { NextResponse, type NextRequest } from "next/server";

import { getAppOrigin, isAllowedAppOrigin } from "@/lib/app-url";
import { getLocalizedPath, isLocale } from "@/lib/i18n";
import { createVerificationCheckoutSession } from "@/lib/stripe/api";
import { isStripeServerConfigured } from "@/lib/stripe/config";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type CheckoutSupplierRow = {
  id: string;
  owner_id: string | null;
  stripe_customer_id: string | null;
  verification_subscription_status:
    | "inactive"
    | "active"
    | "past_due"
    | "canceled";
};

export async function POST(request: NextRequest) {
  const origin = getAppOrigin(request.nextUrl.origin);
  const requestedLocale = request.nextUrl.searchParams.get("locale") ?? "";
  const locale = isLocale(requestedLocale) ? requestedLocale : "en";
  const verificationPath = getLocalizedPath(
    locale,
    "/dashboard/settings/verification",
  );

  if (
    !isAllowedAppOrigin(request.headers.get("origin"), request.nextUrl.origin)
  ) {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        mode: "auth-required",
        url: `${origin}${getLocalizedPath(locale, "/login")}?status=auth-required&next=${encodeURIComponent(
          verificationPath,
        )}`,
      });
    }

    const { data: supplierData, error } = await supabase
      .from("suppliers")
      .select(
        "id, owner_id, stripe_customer_id, verification_subscription_status",
      )
      .eq("owner_id", user.id)
      .maybeSingle();
    const supplier = supplierData as unknown as CheckoutSupplierRow | null;

    if (error || !supplier) {
      return NextResponse.json({
        mode: "supplier-required",
        url: `${origin}${verificationPath}?status=supplier-missing`,
        message: "Supplier profile is required.",
      });
    }

    if (!isStripeServerConfigured()) {
      return NextResponse.json({
        mode: "placeholder",
        url: `${origin}${verificationPath}?checkout=placeholder`,
        message:
          "Stripe checkout is ready to connect once STRIPE_SECRET_KEY and STRIPE_VERIFICATION_PRICE_ID are configured.",
      });
    }

    if (
      supplier.verification_subscription_status === "active" ||
      supplier.verification_subscription_status === "past_due"
    ) {
      return NextResponse.json({
        mode: "existing-subscription",
        url: `${origin}${verificationPath}?checkout=existing`,
        message: "Manage the existing verification membership instead.",
      });
    }

    const session = await createVerificationCheckoutSession({
      origin,
      returnPath: verificationPath,
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
    console.error(
      "Unable to create Stripe checkout session",
      error instanceof Error ? error.message : error,
    );

    return NextResponse.json(
      {
        mode: "error",
        url: `${origin}${verificationPath}?checkout=error`,
        message: "Unable to create checkout session.",
      },
      { status: 500 },
    );
  }
}
