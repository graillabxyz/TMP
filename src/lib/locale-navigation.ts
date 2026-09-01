type NavigationLocale = "en" | "fr" | "tr";

export function getLocalizedHref(pathname: string, locale: NavigationLocale) {
  if (locale === "en") return pathname;
  return pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
}

export function getLocaleHref(
  pathname: string,
  searchParams: URLSearchParams,
  locale: NavigationLocale,
) {
  const segments = pathname.split("/");
  const currentPrefix = segments[1];
  const pathWithoutLocale =
    currentPrefix === "fr" || currentPrefix === "tr"
      ? `/${segments.slice(2).join("/")}`
      : pathname;
  const normalizedPath =
    pathWithoutLocale === "/" || pathWithoutLocale === ""
      ? "/"
      : pathWithoutLocale.replace(/\/$/, "");
  const localizedPath = getLocalizedHref(normalizedPath, locale);
  const query = searchParams.toString();

  return query ? `${localizedPath}?${query}` : localizedPath;
}
