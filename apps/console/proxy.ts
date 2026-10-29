import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAMES } from "@workspace/auth/cookies";

// Paths that bypass auth checks
const PUBLIC_PATHS = [
  "/login",
  "/auth/callback",
  "/api/auth/login",
  "/api/auth/logout",
  "/favicon.ico",
  "/icon.svg",
];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Allow Next.js static files and internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const token = request.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  const session = request.cookies.get(COOKIE_NAMES.USER_SESSION)?.value;
  const isAuthenticated = Boolean(token || session);

  // 2. If user is already authenticated and visits /login -> redirect to dashboard
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. If user is NOT authenticated and attempts to access protected routes -> redirect to /login
  if (!isAuthenticated && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
