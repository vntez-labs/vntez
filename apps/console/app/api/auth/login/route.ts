import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirectTarget = searchParams.get("redirect");
  const loginUrl = redirectTarget
    ? `/login?redirect=${encodeURIComponent(redirectTarget)}`
    : "/login";

  return NextResponse.redirect(new URL(loginUrl, request.url));
}
