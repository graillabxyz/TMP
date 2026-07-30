"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getAppOrigin } from "@/lib/app-url";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

type AuthMode = "login" | "register";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getAuthMode(formData: FormData): AuthMode {
  return getString(formData, "auth_mode") === "register" ? "register" : "login";
}

function getSafeNextPath(formData: FormData) {
  const next = getString(formData, "next");

  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }

  return next;
}

async function getOrigin() {
  const headerStore = await headers();

  return getAppOrigin(headerStore.get("origin"));
}

async function getConfiguredSupabase(page: "login" | "register") {
  try {
    return await createServerSupabaseClient();
  } catch (error) {
    console.error("Supabase auth client is not configured", error);
    redirect(`/${page}?status=error`);
  }
}

export async function signUpWithEmail(formData: FormData) {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const fullName = getString(formData, "full_name");
  const nextPath = getSafeNextPath(formData);

  if (
    !email ||
    email.length > 254 ||
    password.length < 8 ||
    password.length > 128 ||
    !fullName ||
    fullName.length > 100
  ) {
    redirect(`/register?status=missing&next=${encodeURIComponent(nextPath)}`);
  }

  const origin = await getOrigin();
  const supabase = await getConfiguredSupabase("register");
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
        nextPath,
      )}`,
      data: {
        role: "buyer",
        full_name: fullName,
      },
    },
  });

  if (error) {
    console.error("Unable to sign up", error.message);
    redirect(`/register?status=error&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(`/login?status=check-email&next=${encodeURIComponent(nextPath)}`);
}

export async function signInWithEmail(formData: FormData) {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const nextPath = getSafeNextPath(formData);

  if (!email || !password) {
    redirect(`/login?status=missing&next=${encodeURIComponent(nextPath)}`);
  }

  const supabase = await getConfiguredSupabase("login");
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Unable to sign in", error.message);
    redirect(`/login?status=error&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(nextPath);
}

export async function signInWithGoogle(formData: FormData) {
  const authMode = getAuthMode(formData);
  const nextPath = getSafeNextPath(formData);
  const origin = await getOrigin();
  const supabase = await getConfiguredSupabase(authMode);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
        nextPath,
      )}`,
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

    redirect(
      `/${authMode}?status=oauth-error&next=${encodeURIComponent(nextPath)}`,
    );
  }

  redirect(data.url);
}
