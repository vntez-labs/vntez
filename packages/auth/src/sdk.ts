/**
 * VNTEZ SDK Singleton
 * Shared @vntez/sdk instance for client-side SSO (OAuth 2.0 PKCE).
 *
 * The SDK is browser-only (sessionStorage / crypto.subtle / window), so this
 * module must only be imported from client components. A single instance is
 * lazily created and cached per appId to avoid re-instantiating modules.
 *
 * Config resolved from NEXT_PUBLIC_* environment variables:
 *   NEXT_PUBLIC_VNTEZ_CLIENT_ID  -> appId      (default: 'vntez')
 *   NEXT_PUBLIC_VNTEZ_IAM_URL    -> iamUrl     (default: 'https://vntez-iam.vercel.app')
 *   NEXT_PUBLIC_VNTEZ_REDIRECT_URI -> redirectUri (used by signIn)
 */

'use client';

import { VntezClient } from '@vntez/sdk';

export const VNTEZ_DEFAULT_IAM_URL = 'https://vntez-iam.vercel.app';
export const VNTEZ_DEFAULT_APP_ID = 'vntez';

let instance: VntezClient | null = null;

/**
 * Resolves the SDK client ID / appId from public env vars.
 */
export function resolveVntezAppId(): string {
  return process.env.NEXT_PUBLIC_VNTEZ_CLIENT_ID || VNTEZ_DEFAULT_APP_ID;
}

/**
 * Resolves the IAM base URL from public env vars.
 */
export function resolveVntezIamUrl(): string {
  return process.env.NEXT_PUBLIC_VNTEZ_IAM_URL || VNTEZ_DEFAULT_IAM_URL;
}

/**
 * Resolves the OAuth redirect URI registered in VNTEZ IAM Developer Hub.
 */
export function resolveVntezRedirectUri(): string {
  return process.env.NEXT_PUBLIC_VNTEZ_REDIRECT_URI || '/auth/callback';
}

/**
 * Returns the shared VntezClient singleton.
 * Lazily instantiated on first call and cached for the page lifetime.
 */
export function getVntezClient(): VntezClient {
  if (!instance) {
    instance = new VntezClient({
      appId: resolveVntezAppId(),
      iamUrl: resolveVntezIamUrl(),
    });
  }
  return instance;
}

/**
 * Triggers the SSO sign-in redirect to VNTEZ IAM using the configured redirect URI.
 */
export async function signInWithVntez(redirectUri?: string): Promise<void> {
  await getVntezClient().auth.signIn({
    redirectUri: redirectUri ?? resolveVntezRedirectUri(),
  });
}

/**
 * Returns true when the SDK holds an access token for the current app.
 */
export function isVntezAuthenticated(): boolean {
  return getVntezClient().auth.isAuthenticated();
}

/**
 * Reads the current VNTEZ user profile from the SDK cache.
 */
export function getVntezUser() {
  return getVntezClient().auth.getUser();
}

/**
 * Signs out from VNTEZ IAM via the SDK (clears SDK token cache first).
 */
export function signOutFromVntez(redirectUrl?: string): void {
  getVntezClient().auth.signOut(redirectUrl);
}

