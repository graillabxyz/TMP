"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  defaultLocale,
  getLocalizedPath,
  isLocale,
  type Locale,
} from "@/lib/i18n";

function stripLocalePrefix(path: string) {
  const [, maybeLocale, ...segments] = path.split("/");

  if (!isLocale(maybeLocale)) {
    return path;
  }

  return `/${segments.join("/")}`.replace(/\/$/, "") || "/";
}

function getSafeRedirectPath(referer: string | null, locale: Locale) {
  if (!referer) {
    return getLocalizedPath(locale, "/");
  }

  try {
    const url = new URL(referer);
    const path = stripLocalePrefix(url.pathname || "/");

    return `${getLocalizedPath(locale, path)}${url.search}`;
  } catch {
    return getLocalizedPath(locale, "/");
  }
}

export async function setLocale(formData: FormData) {
  const requestedLocale = formData.get("locale");
  const locale =
    typeof requestedLocale === "string" && isLocale(requestedLocale)
      ? requestedLocale
      : defaultLocale;

  const cookieStore = await cookies();
  cookieStore.set("tmp-locale", locale, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/", "layout");
  redirect(getSafeRedirectPath((await headers()).get("referer"), locale));
}
