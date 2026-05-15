import { NextResponse, type NextRequest } from "next/server";

import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileMutationTable = {
  upsert: (
    payload: ProfileInsert,
  ) => Promise<{ error: { message: string } | null }>;
};
type SupplierProfileRpcClient = {
  rpc: (
    functionName: "ensure_supplier_profile",
    args: { company: string | null },
  ) => Promise<{ error: { message: string } | null }>;
};

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

function getRole(value: string | null) {
  return value === "supplier" ? "supplier" : "buyer";
}

function getUserCompany(user: { email?: string; user_metadata?: unknown }) {
  const metadata =
    user.user_metadata && typeof user.user_metadata === "object"
      ? (user.user_metadata as Record<string, unknown>)
      : {};
  const metadataCompany =
    typeof metadata.company === "string" ? metadata.company.trim() : "";
  const fullName =
    typeof metadata.full_name === "string" ? metadata.full_name.trim() : "";
  const name = typeof metadata.name === "string" ? metadata.name.trim() : "";

  return (
    metadataCompany ||
    fullName ||
    name ||
    user.email?.split("@")[0] ||
    "Supplier"
  );
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = getSafeNextPath(url.searchParams.get("next"));
  const role = getRole(url.searchParams.get("role"));
  const redirectUrl = new URL(next, url.origin);

  if (!code) {
    redirectUrl.searchParams.set("status", "auth-error");

    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Unable to exchange auth code", error.message);
    redirectUrl.searchParams.set("status", "auth-error");

    return NextResponse.redirect(redirectUrl);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const profileMutations = supabase.from(
      "profiles",
    ) as unknown as ProfileMutationTable;
    const { error: profileError } = await profileMutations.upsert({
      id: user.id,
      email: user.email ?? "",
      role,
    });

    if (profileError) {
      console.error("Unable to upsert OAuth profile", profileError.message);
    }

    if (role === "supplier") {
      const supplierProfileRpc =
        supabase as unknown as SupplierProfileRpcClient;
      const { error: supplierError } = await supplierProfileRpc.rpc(
        "ensure_supplier_profile",
        { company: getUserCompany(user) },
      );

      if (supplierError) {
        console.error(
          "Unable to ensure OAuth supplier profile",
          supplierError.message,
        );
      }
    }
  }

  return NextResponse.redirect(redirectUrl);
}
