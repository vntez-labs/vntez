import { NextResponse } from "next/server";
import { getServerSession, refreshServerSessionCookie } from "@workspace/auth/server";

export async function GET() {
  const { user, accessToken } = await getServerSession();

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  // Sliding session: extend persistent cookie lifespan for another 30 days
  await refreshServerSessionCookie(user);

  return NextResponse.json({
    authenticated: true,
    user,
    accessToken: accessToken ? `${accessToken.slice(0, 8)}...` : null,
  });
}
