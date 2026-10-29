import { NextRequest, NextResponse } from "next/server";
import { handleOAuthCallback } from "@workspace/auth/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle errors sent directly from the IdP (e.g. user cancelled or unauthorized client)
  if (oauthError) {
    const errorMsg = errorDescription || oauthError;
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMsg)}`, request.url)
    );
  }

  const clientId =
    process.env.VNTEZ_CLIENT_ID ||
    process.env.NEXT_PUBLIC_VNTEZ_CLIENT_ID ||
    "vntez_c18f43a315d368109d4d8aca";

  const clientSecret = process.env.VNTEZ_CLIENT_SECRET;
  const baseUrl = process.env.VNTEZ_BASE_URL || "https://vntez-id.vercel.app";

  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  const origin = configuredAppUrl || request.nextUrl.origin;
  const redirectUri = `${origin}/auth/callback`;

  const result = await handleOAuthCallback({
    code,
    state,
    clientId,
    clientSecret,
    redirectUri,
    baseUrl,
  });

  if (!result.success) {
    const errorParam = encodeURIComponent(result.error || "Xác thực thất bại");
    return NextResponse.redirect(new URL(`/login?error=${errorParam}`, request.url));
  }

  const destination = result.returnTo || "/";
  return NextResponse.redirect(new URL(destination, request.url));
}
