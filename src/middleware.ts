import { NextResponse, type NextRequest } from "next/server";

const localeCookieName = "tmp-locale";
const defaultLocale = "en";
const locales = ["en", "fr", "tr"] as const;
type Locale = (typeof locales)[number];

function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

function setRequestLocale(headers: Headers, locale: string) {
  headers.set("x-tmp-locale", locale);

  const cookies = headers
    .get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .filter((cookie) => cookie && !cookie.startsWith(`${localeCookieName}=`));

  headers.set(
    "cookie",
    [...(cookies ?? []), `${localeCookieName}=${locale}`].join("; "),
  );
}

function getCookieOptions(request: NextRequest) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure:
      process.env.NODE_ENV === "production" &&
      request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  };
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const [, maybeLocale, ...segments] = url.pathname.split("/");
  const requestHeaders = new Headers(request.headers);
  const propagatedLocale = request.headers.get("x-tmp-locale") ?? undefined;

  if (!isLocale(maybeLocale)) {
    const locale: Locale = isLocale(propagatedLocale)
      ? propagatedLocale
      : defaultLocale;

    setRequestLocale(requestHeaders, locale);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.cookies.set(
      localeCookieName,
      locale,
      getCookieOptions(request),
    );

    return response;
  }

  const targetPath = `/${segments.join("/")}`.replace(/\/$/, "") || "/";
  url.pathname = targetPath;

  setRequestLocale(requestHeaders, maybeLocale);

  const response = NextResponse.rewrite(url, {
    request: {
      headers: requestHeaders,
    },
  });
  response.cookies.set(localeCookieName, maybeLocale, getCookieOptions(request));

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
