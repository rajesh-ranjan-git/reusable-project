import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authRoutes, defaultRoutes } from "@/lib/routes/routes";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith(authRoutes.verifyEmail) ||
    pathname.startsWith(authRoutes.resetPassword)
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
  matcher: [
    "/((?!api|_next|static|assets|favicon.ico|manifest.json|.*\\..*).*)",
  ],
};
