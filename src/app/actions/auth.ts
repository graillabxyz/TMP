"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getAppOrigin } from "@/lib/app-url";
import {
  isValidEmail,
  isValidFullName,
  isValidPassword,
} from "@/lib/auth-validation";
import { getLocalizedPath, isLocale, type Locale } from "@/lib/i18n";
import { getSafeInternalPath } from "@/lib/safe-redirect";
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
  return getSafeInternalPath(getString(formData, "next"));
}

function getFormLocale(formData: FormData): Locale {
  const locale = getString(formData, "locale");

  return isLocale(locale) ? locale : "en";
}

function getAuthPath(locale: Locale, page: string) {
  return getLocalizedPath(locale, `/${page}`);
}

async function getOrigin() {
  const headerStore = await headers();

  return getAppOrigin(headerStore.get("origin"));
}

async function getConfiguredSupabase(
  page: "login" | "register" | "forgot-password" | "reset-password",
  locale: Locale,
) {
  try {
    return await createServerSupabaseClient();
  } catch (error) {
    console.error("Supabase auth client is not configured", error);
    redirect(`${getAuthPath(locale, page)}?status=error`);
  }
}

export async function signUpWithEmail(formData: FormData) {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const fullName = getString(formData, "full_name");
  const nextPath = getSafeNextPath(formData);
  const locale = getFormLocale(formData);
  const registerPath = getAuthPath(locale, "register");
  const loginPath = getAuthPath(locale, "login");

  if (
    !isValidEmail(email) ||
    !isValidPassword(password) ||
    !isValidFullName(fullName)
  ) {
    redirect(
      `${registerPath}?status=missing&next=${encodeURIComponent(nextPath)}`,
    );
  }

  const origin = await getOrigin();
  const supabase = await getConfiguredSupabase("register", locale);
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
        nextPath,
      )}&locale=${locale}&auth_mode=register`,
      data: {
        role: "buyer",
        full_name: fullName,
      },
    },
  });

  if (error) {
    console.error("Unable to sign up", error.message);
    redirect(
      `${registerPath}?status=error&next=${encodeURIComponent(nextPath)}`,
    );
  }

  redirect(
    `${loginPath}?status=check-email&next=${encodeURIComponent(nextPath)}`,
  );
}

export async function signInWithEmail(formData: FormData) {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const nextPath = getSafeNextPath(formData);
  const locale = getFormLocale(formData);
  const loginPath = getAuthPath(locale, "login");

  if (!isValidEmail(email) || !password || password.length > 128) {
    redirect(
      `${loginPath}?status=missing&next=${encodeURIComponent(nextPath)}`,
    );
  }

  const supabase = await getConfiguredSupabase("login", locale);
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Unable to sign in", error.message);
    redirect(`${loginPath}?status=error&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(nextPath);
}

export async function signInWithGoogle(formData: FormData) {
  const authMode = getAuthMode(formData);
  const nextPath = getSafeNextPath(formData);
  const locale = getFormLocale(formData);
  const origin = await getOrigin();
  const supabase = await getConfiguredSupabase(authMode, locale);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
        nextPath,
      )}&locale=${locale}&auth_mode=${authMode}`,
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
      `${getAuthPath(locale, authMode)}?status=oauth-error&next=${encodeURIComponent(
        nextPath,
      )}`,
    );
  }

  redirect(data.url);
}

export async function signOut(formData: FormData) {
  const nextPath = getSafeInternalPath(getString(formData, "next"), "/");
  const locale = getFormLocale(formData);
  const supabase = await getConfiguredSupabase("login", locale);
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Unable to sign out", error.message);
  }

  redirect(nextPath);
}

export async function requestPasswordReset(formData: FormData) {
  const email = getString(formData, "email");
  const locale = getFormLocale(formData);
  const forgotPath = getAuthPath(locale, "forgot-password");
  const resetPath = getAuthPath(locale, "reset-password");

  if (!isValidEmail(email)) {
    redirect(`${forgotPath}?status=missing`);
  }

  const origin = await getOrigin();
  const supabase = await getConfiguredSupabase("forgot-password", locale);
  const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(
    resetPath,
  )}&locale=${locale}&flow=reset`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackUrl,
  });

  if (error) {
    console.error("Unable to request password reset", error.message);
  }

  redirect(`${forgotPath}?status=sent`);
}

export async function updatePassword(formData: FormData) {
  const password = getString(formData, "password");
  const confirmation = getString(formData, "password_confirmation");
  const locale = getFormLocale(formData);
  const resetPath = getAuthPath(locale, "reset-password");
  const loginPath = getAuthPath(locale, "login");

  if (!isValidPassword(password) || password !== confirmation) {
    redirect(`${resetPath}?status=missing`);
  }

  const supabase = await getConfiguredSupabase("reset-password", locale);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`${resetPath}?status=expired`);
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("Unable to update password", error.message);
    redirect(`${resetPath}?status=error`);
  }

  redirect(`${loginPath}?status=password-updated`);
}
