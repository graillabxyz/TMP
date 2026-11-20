import { NextResponse, type NextRequest } from "next/server";
import { retrieveCheckoutSession } from "@/lib/stripe/api";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("session_id") ?? "";
  if (!/^cs_(test|live)_[a-zA-Z0-9]+$/.test(id) || id.length > 250)
    return NextResponse.json({ state: "error" }, { status: 400 });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ state: "error" }, { status: 401 });
  try {
    const session = await retrieveCheckoutSession(id);
    if (session.metadata?.owner_id !== user.id)
      return NextResponse.json({ state: "error" }, { status: 404 });
    const { data, error } = await supabase
      .from("suppliers")
      .select("stripe_subscription_id, verification_subscription_status")
      .eq("id", session.metadata.supplier_id ?? "")
      .eq("owner_id", user.id)
      .single();
    if (error || !data)
      return NextResponse.json({ state: "error" }, { status: 404 });
    const supplier = data as {
      stripe_subscription_id: string | null;
      verification_subscription_status: string;
    };
    const active =
      session.status === "complete" &&
      session.payment_status === "paid" &&
      supplier.stripe_subscription_id === session.subscription &&
      supplier.verification_subscription_status === "active";
    return NextResponse.json(
      {
        state: active
          ? "active"
          : session.status === "expired"
            ? "expired"
            : "pending",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ state: "error" }, { status: 503 });
  }
}
