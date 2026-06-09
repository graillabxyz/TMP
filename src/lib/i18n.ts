import { cookies } from "next/headers";

export const locales = ["en", "fr", "tr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("tmp-locale")?.value;

  return isLocale(locale) ? locale : defaultLocale;
}

export function localizedValue(
  locale: Locale,
  english: string,
  french?: string | null,
  turkish?: string | null,
) {
  if (locale === "tr" && turkish) {
    return turkish;
  }

  return locale === "fr" && french ? french : english;
}

export function localizedArray(
  locale: Locale,
  english: string[],
  french?: string[] | null,
  turkish?: string[] | null,
) {
  if (locale === "tr" && turkish?.length) {
    return turkish;
  }

  return locale === "fr" && french?.length ? french : english;
}
