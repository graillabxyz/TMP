import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { getDemoProfile } from "@/lib/demo-session";

export type AccountRole = "buyer" | "supplier" | "admin";

export type CurrentProfile = {
  id: string;
  email: string;
  role: AccountRole;
} | null;

export async function getCurrentProfile(): Promise<CurrentProfile> {
  const demoProfile = await getDemoProfile();

  if (demoProfile) {
    return demoProfile;
  }

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
    .select("id, email, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Unable to load current profile", error.message);

    return {
      id: user.id,
      email: user.email ?? "",
      role: "buyer",
    };
  }

  return (data as CurrentProfile) ?? {
    id: user.id,
    email: user.email ?? "",
    role: "buyer",
  };
}
