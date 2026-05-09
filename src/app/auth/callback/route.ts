import { NextResponse, type NextRequest } from "next/server";

import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileMutationTable = {
  upsert: (
    payload: ProfileInsert,
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
  }

  return NextResponse.redirect(redirectUrl);
}
