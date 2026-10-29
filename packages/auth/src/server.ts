/**
 * Server-Side Authentication & PKCE Handlers
 * RFC 7636 & RFC 6749 Implementation for Next.js App Router
 */

import { cookies } from 'next/headers';
import { generatePKCE } from './pkce';
import { buildAuthorizeUrl, exchangeToken, fetchUserInfo, VNTEZ_DEFAULT_BASE_URL } from './client';
import { COOKIE_NAMES, DEFAULT_COOKIE_OPTIONS, PKCE_COOKIE_MAX_AGE, DEFAULT_SESSION_MAX_AGE } from './cookies';
import { fixVietnameseEncoding } from './encoding';
import type { VntezUser, VntezTokenResponse } from './types';

export interface InitiatePKCEOptions {
  clientId: string;
  redirectUri: string;
  baseUrl?: string;
  returnTo?: string;
}

export interface CallbackResult {
  success: boolean;
  user?: VntezUser;
  token?: VntezTokenResponse;
  returnTo?: string;
  error?: string;
}

/**
 * Step 1 & 2: Initiate the PKCE Flow
 * Generates code_verifier, code_challenge (S256), state and sets secure HTTP-only cookies.
 * Returns the VNTEZ ID Authorization URL.
 */
export async function initiatePKCEFlow({
  clientId,
  redirectUri,
  baseUrl = VNTEZ_DEFAULT_BASE_URL,
  returnTo,
}: InitiatePKCEOptions): Promise<string> {
  const { codeVerifier, codeChallenge, state } = await generatePKCE();
  const cookieStore = await cookies();

  // Set PKCE code_verifier (HTTP-Only, Secure, SameSite=Lax)
  cookieStore.set(COOKIE_NAMES.CODE_VERIFIER, codeVerifier, {
    ...DEFAULT_COOKIE_OPTIONS,
    maxAge: PKCE_COOKIE_MAX_AGE,
  });

  // Set Anti-CSRF state (HTTP-Only, Secure, SameSite=Lax)
  cookieStore.set(COOKIE_NAMES.STATE, state, {
    ...DEFAULT_COOKIE_OPTIONS,
    maxAge: PKCE_COOKIE_MAX_AGE,
  });

  // Store returnTo target if supplied
  if (returnTo) {
    cookieStore.set(COOKIE_NAMES.REDIRECT_TARGET, returnTo, {
      ...DEFAULT_COOKIE_OPTIONS,
      maxAge: PKCE_COOKIE_MAX_AGE,
    });
  }

  // Generate VNTEZ ID authorize URL
  return buildAuthorizeUrl({
    baseUrl,
    clientId,
    redirectUri,
    state,
    codeChallenge,
  });
}

/**
 * Step 3 & 4: Process OAuth Callback
 * Validates state against cookie (Anti-CSRF), retrieves code_verifier,
 * exchanges authorization code for token, and fetches userinfo.
 */
export async function handleOAuthCallback({
  code,
  state,
  clientId,
  clientSecret,
  redirectUri,
  baseUrl = VNTEZ_DEFAULT_BASE_URL,
}: {
  code: string | null;
  state: string | null;
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  baseUrl?: string;
}): Promise<CallbackResult> {
  const cookieStore = await cookies();

  if (!code) {
    return { success: false, error: 'Thiếu Authorization Code từ VNTEZ ID.' };
  }

  // 1. Validate State against Cookie (Anti-CSRF)
  const storedState = cookieStore.get(COOKIE_NAMES.STATE)?.value;
  if (!state || !storedState || state !== storedState) {
    return {
      success: false,
      error: 'Xác thực CSRF State không hợp lệ hoặc phiên đăng nhập đã hết hạn. Vui lòng thử lại.',
    };
  }

  // 2. Retrieve code_verifier from Cookie
  const codeVerifier = cookieStore.get(COOKIE_NAMES.CODE_VERIFIER)?.value;
  if (!codeVerifier) {
    return {
      success: false,
      error: 'Không tìm thấy code_verifier trong cookie phiên đăng nhập.',
    };
  }

  // Retrieve optional return destination
  const returnTo = cookieStore.get(COOKIE_NAMES.REDIRECT_TARGET)?.value || '/';

  try {
    // 3. Exchange code for access_token at /oauth/token
    const tokenResponse = await exchangeToken({
      baseUrl,
      clientId,
      clientSecret,
      code,
      codeVerifier,
      redirectUri,
    });

    // 4. Fetch user profile from /oauth/userinfo
    const rawUser = await fetchUserInfo(tokenResponse.access_token, baseUrl);
    const user: VntezUser = {
      ...rawUser,
      name: fixVietnameseEncoding(rawUser.name),
    };

    // Save access token cookie
    cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, tokenResponse.access_token, {
      ...DEFAULT_COOKIE_OPTIONS,
      maxAge: tokenResponse.expires_in || DEFAULT_SESSION_MAX_AGE,
    });

    // Save session payload cookie (URL encoded to prevent header ASCII encoding corruption)
    cookieStore.set(COOKIE_NAMES.USER_SESSION, encodeURIComponent(JSON.stringify(user)), {
      ...DEFAULT_COOKIE_OPTIONS,
      maxAge: tokenResponse.expires_in || DEFAULT_SESSION_MAX_AGE,
    });

    // Cleanup transient PKCE cookies
    cookieStore.delete(COOKIE_NAMES.CODE_VERIFIER);
    cookieStore.delete(COOKIE_NAMES.STATE);
    cookieStore.delete(COOKIE_NAMES.REDIRECT_TARGET);

    return {
      success: true,
      user,
      token: tokenResponse,
      returnTo,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi trong quá trình xác thực VNTEZ ID',
    };
  }
}

/**
 * Retrieve current user session from cookies
 */
export async function getServerSession(): Promise<{
  user: VntezUser | null;
  accessToken: string | null;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value || null;
    const sessionCookie = cookieStore.get(COOKIE_NAMES.USER_SESSION)?.value;

    if (!sessionCookie) {
      return { user: null, accessToken: null };
    }

    let jsonStr = sessionCookie;
    try {
      jsonStr = decodeURIComponent(sessionCookie);
    } catch {}

    const parsed = JSON.parse(jsonStr) as VntezUser;
    const user: VntezUser = {
      ...parsed,
      name: fixVietnameseEncoding(parsed.name),
    };

    return { user, accessToken: token };
  } catch {
    return { user: null, accessToken: null };
  }
}

/**
 * Clear user session cookies (Logout)
 */
export async function clearServerSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
  cookieStore.delete(COOKIE_NAMES.USER_SESSION);
  cookieStore.delete(COOKIE_NAMES.CODE_VERIFIER);
  cookieStore.delete(COOKIE_NAMES.STATE);
  cookieStore.delete(COOKIE_NAMES.REDIRECT_TARGET);
}
