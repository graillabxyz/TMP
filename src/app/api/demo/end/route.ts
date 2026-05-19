import { NextResponse, type NextRequest } from "next/server";

import { getDemoCookieName } from "@/lib/demo-session";

export function GET(request: NextRequest) {
  const url = new URL(request.url);
  const response = NextResponse.redirect(new URL("/login", url));

  response.cookies.delete(getDemoCookieName());

  return response;
}
