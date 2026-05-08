"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { defaultLocale, isLocale } from "@/lib/i18n";

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
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/", "layout");
}
