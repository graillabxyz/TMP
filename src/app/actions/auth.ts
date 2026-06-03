"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getAppOrigin } from "@/lib/app-url";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

type AccountRole = "buyer" | "supplier";
type AuthMode = "login" | "register";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getRole(formData: FormData): AccountRole {
  return getString(formData, "role") === "supplier" ? "supplier" : "buyer";
}

function getAuthMode(formData: FormData): AuthMode {
  return getString(formData, "auth_mode") === "register"
    ? "register"
    : "login";
}

async function getOrigin() {
  const headerStore = await headers();

  return getAppOrigin(headerStore.get("origin"));
}

function getRedirectPath(role: AccountRole) {
  return role === "supplier"
    ? "/dashboard/settings/verification"
    : "/dashboard";
}

async function getConfiguredSupabase(
  role: AccountRole,
  page: "login" | "register",
) {
  try {
    return await createServerSupabaseClient();
  } catch (error) {
    console.error("Supabase auth client is not configured", error);
    redirect(`/${page}?role=${role}&status=error`);
  }
}

export async function signUpWithEmail(formData: FormData) {
  const role = getRole(formData);
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const fullName = getString(formData, "full_name");
  const company = getString(formData, "company");

  if (!email || !password || !fullName || (role === "supplier" && !company)) {
    redirect(`/register?role=${role}&status=missing`);
  }

  const origin = await getOrigin();
  const supabase = await getConfiguredSupabase(role, "register");
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
        getRedirectPath(role),
      )}&role=${role}`,
      data: {
        role,
        full_name: fullName,
        company,
      },
    },
  });

  if (error) {
    console.error("Unable to sign up", error.message);
    redirect(`/register?role=${role}&status=error`);
  }

  redirect(`/login?role=${role}&status=check-email`);
}

export async function signInWithEmail(formData: FormData) {
  const role = getRole(formData);
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  if (!email || !password) {
    redirect(`/login?role=${role}&status=missing`);
  }

  const supabase = await getConfiguredSupabase(role, "login");
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Unable to sign in", error.message);
    redirect(`/login?role=${role}&status=error`);
  }

  redirect(getRedirectPath(role));
}

export async function signInWithGoogle(formData: FormData) {
  const role = getRole(formData);
  const authMode = getAuthMode(formData);
  const origin = await getOrigin();
  const supabase = await getConfiguredSupabase(role, authMode);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
        getRedirectPath(role),
      )}&role=${role}`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error || !data.url) {
    if (error) {
      console.error("Unable to start Google OAuth", error.message);
    }

    redirect(`/${authMode}?role=${role}&status=oauth-error`);
  }

  redirect(data.url);
}
