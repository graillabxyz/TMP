type NavigationLocale = "en" | "fr" | "tr";

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
  const localizedPath =
    locale === "en"
      ? normalizedPath
      : normalizedPath === "/"
        ? `/${locale}`
        : `/${locale}${normalizedPath}`;
  const query = searchParams.toString();

  return query ? `${localizedPath}?${query}` : localizedPath;
}
