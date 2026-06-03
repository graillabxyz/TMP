"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { defaultLocale, isLocale } from "@/lib/i18n";

function getSafeRedirectPath(referer: string | null) {
  if (!referer) {
    return "/";
  }

  try {
    const url = new URL(referer);

    return `${url.pathname}${url.search}` || "/";
  } catch {
    return "/";
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
  redirect(getSafeRedirectPath((await headers()).get("referer")));
}
