import { authRoutes, defaultRoutes } from "@/lib/routes/routes";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/assets") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("refreshToken")?.value ?? null;

  const isAuthRoute = Object.values(authRoutes).some((route) =>
    pathname.startsWith(route),
  );

  const isProtected = !isAuthRoute && pathname !== defaultRoutes.landing;

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtected && !token) {
    const loginUrl = new URL(authRoutes.login, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|manifest.json).*)"],
};
