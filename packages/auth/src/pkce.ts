/**
 * PKCE (Proof Key for Code Exchange) Utilities
 * RFC 7636 & RFC 6749
 *
 * Implements cryptographically secure code_verifier, code_challenge (S256),
 * and state generator compliant with standard OAuth 2.0 PKCE specs.
 */

import type { PKCECodes } from './types';

/**
 * Base64URL encoder without padding as defined in RFC 7636 section 4.1
 */
export function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Generates a cryptographically random code_verifier (RFC 7636 Section 4.1).
 * Unreserved characters: [A-Z], [a-z], [0-9], "-", ".", "_", "~"
 * Minimum length: 43, Maximum length: 128. Default: 64 characters.
 */
export function generateCodeVerifier(length = 64): string {
  if (length < 43 || length > 128) {
    throw new Error('PKCE code_verifier length must be between 43 and 128 characters (RFC 7636).');
  }

  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);

  return Array.from(randomBytes)
    .map((byte) => charset[byte % charset.length])
    .join('');
}

/**
 * Computes the S256 code_challenge from code_verifier (RFC 7636 Section 4.2).
 * code_challenge = BASE64URL-ENCODE(SHA256(ASCII(code_verifier)))
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(digest);
}

/**
 * Generates a cryptographically secure random state string (RFC 6749 Section 10.12)
 * to prevent Cross-Site Request Forgery (CSRF).
 * Default: 32 characters.
 */
export function generateState(length = 32): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);

  return Array.from(randomBytes)
    .map((byte) => charset[byte % charset.length])
    .join('');
}

/**
 * Generates all PKCE credentials in a single step
 */
export async function generatePKCE(): Promise<PKCECodes> {
  const codeVerifier = generateCodeVerifier(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState(32);

  return {
    codeVerifier,
    codeChallenge,
    state,
  };
}
