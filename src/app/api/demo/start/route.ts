import { NextResponse, type NextRequest } from "next/server";

import {
  getDemoCookieName,
  isDemoAuthEnabled,
  isValidDemoToken,
} from "@/lib/demo-session";

function getSafeRole(value: string | null) {
  return value === "supplier" ? "supplier" : "buyer";
}

export function GET(request: NextRequest) {
  const url = new URL(request.url);
  const role = getSafeRole(url.searchParams.get("role"));
  const token = url.searchParams.get("token");
  const nextPath =
    url.searchParams.get("next")?.startsWith("/") === true
      ? url.searchParams.get("next")
      : "/dashboard";

  if (!isDemoAuthEnabled() || !isValidDemoToken(token)) {
    return NextResponse.redirect(new URL("/login?status=auth-error", url));
  }

  const response = NextResponse.redirect(new URL(nextPath ?? "/dashboard", url));
  response.cookies.set(getDemoCookieName(), role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
  });

  return response;
}
