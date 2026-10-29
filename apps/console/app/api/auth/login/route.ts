import { NextRequest, NextResponse } from "next/server";
import { initiatePKCEFlow } from "@workspace/auth/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const returnTo = searchParams.get("redirect") || "/";

  const clientId =
    process.env.VNTEZ_CLIENT_ID ||
    process.env.NEXT_PUBLIC_VNTEZ_CLIENT_ID ||
    "vntez-console-app";

  const baseUrl = process.env.VNTEZ_BASE_URL || "https://vntez-id.vercel.app";

  // Determine redirect URI: env config or request origin + /auth/callback
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  const origin = configuredAppUrl || request.nextUrl.origin;
  const redirectUri = `${origin}/auth/callback`;

  try {
    const authorizeUrl = await initiatePKCEFlow({
      clientId,
      redirectUri,
      baseUrl,
      returnTo,
    });

    return NextResponse.redirect(authorizeUrl);
  } catch (error) {
    console.error("Failed to initiate VNTEZ ID PKCE login:", error);
    return NextResponse.json(
      {
        error: "OAuth PKCE initialization failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
