import { NextResponse, type NextRequest } from "next/server";

const localeCookieName = "tmp-locale";
const defaultLocale = "en";
const locales = ["en", "fr", "tr"] as const;

function isLocale(value: string | undefined) {
  return locales.includes(value as (typeof locales)[number]);
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const [, maybeLocale, ...segments] = url.pathname.split("/");
  const requestHeaders = new Headers(request.headers);

  if (!isLocale(maybeLocale)) {
    requestHeaders.set("x-tmp-locale", defaultLocale);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const targetPath = `/${segments.join("/")}`.replace(/\/$/, "") || "/";

  if (maybeLocale === defaultLocale) {
    url.pathname = targetPath;

    return NextResponse.redirect(url);
  }

  url.pathname = targetPath;

  requestHeaders.set("x-tmp-locale", maybeLocale);

  const response = NextResponse.rewrite(url, {
    request: {
      headers: requestHeaders,
    },
  });
  response.cookies.set(localeCookieName, maybeLocale, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
