import { NextRequest, NextResponse } from "next/server";
import { initiatePKCEFlow } from "@workspace/auth/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const returnTo = searchParams.get("redirect") || "/";

  const clientId =
    process.env.VNTEZ_CLIENT_ID ||
    process.env.NEXT_PUBLIC_VNTEZ_CLIENT_ID ||
    "vntez-console-app";

  const baseUrl = process.env.VNTEZ_BASE_URL || "https://vntez-iam.vercel.app";

  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  const origin = configuredAppUrl || request.nextUrl.origin;
  const redirectUri = `${origin}/auth/callback`;

  try {
    const authorizeUrl = await initiatePKCEFlow({
      clientId,
      redirectUri,
      baseUrl,
      returnTo,
      appId: null,
    });

    return NextResponse.redirect(authorizeUrl);
  } catch (error) {
    console.error("Failed to initiate VNTEZ IAM PKCE login on Web:", error);
    return NextResponse.json(
      {
        error: "OAuth PKCE initialization failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
