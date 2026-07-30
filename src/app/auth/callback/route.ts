import { NextResponse, type NextRequest } from "next/server";

import { getSafeInternalPath } from "@/lib/safe-redirect";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileMutationTable = {
  select: (columns: string) => {
    eq: (
      column: string,
      value: string,
    ) => {
      maybeSingle: () => Promise<{
        data: { id: string } | null;
        error: { message: string } | null;
      }>;
    };
  };
  insert: (
    payload: ProfileInsert,
  ) => Promise<{ error: { message: string } | null }>;
  upsert: (
    payload: ProfileInsert,
  ) => Promise<{ error: { message: string } | null }>;
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = getSafeInternalPath(url.searchParams.get("next"));
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
    const { data: existingProfile, error: profileReadError } =
      await profileMutations.select("id").eq("id", user.id).maybeSingle();

    if (profileReadError) {
      console.error("Unable to read OAuth profile", profileReadError.message);
    }

    if (!existingProfile) {
      const { error: profileError } = await profileMutations.insert({
        id: user.id,
        email: user.email ?? "",
        role: "buyer",
      });

      if (profileError) {
        console.error("Unable to insert OAuth profile", profileError.message);
      }
    }
  }

  return NextResponse.redirect(redirectUrl);
}
