import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export type AccountRole = "buyer" | "supplier" | "admin";

export type CurrentProfile = {
  id: string;
  email: string;
  fullName: string | null;
  role: AccountRole;
} | null;

export async function getCurrentProfile(): Promise<CurrentProfile> {
  let supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;

  try {
    supabase = await createServerSupabaseClient();
  } catch (error) {
    console.error("Supabase server client is not configured", error);

    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Unable to load current profile", error.message);

    return {
      id: user.id,
      email: user.email ?? "",
      fullName:
        typeof user.user_metadata.full_name === "string"
          ? user.user_metadata.full_name
          : null,
      role: "buyer",
    };
  }

  const profile = data as {
    id: string;
    email: string;
    full_name: string | null;
    role: AccountRole;
  } | null;

  return profile
    ? {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        role: profile.role,
      }
    : {
        id: user.id,
        email: user.email ?? "",
        fullName:
          typeof user.user_metadata.full_name === "string"
            ? user.user_metadata.full_name
            : null,
        role: "buyer",
      };
}
