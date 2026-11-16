import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirectTarget = searchParams.get("redirect") || "/";

  return NextResponse.redirect(new URL(redirectTarget, request.url));
}
