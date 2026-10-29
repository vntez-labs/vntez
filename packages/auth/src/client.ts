/**
 * VNTEZ ID OAuth 2.0 PKCE Client
 * RFC 6749 & RFC 7636
 *
 * Interacts with VNTEZ ID server endpoints:
 * 1. GET  /oauth/authorize
 * 2. POST /oauth/token
 * 3. GET  /oauth/userinfo
 */

import type { VntezTokenResponse, VntezUser } from './types';

export const VNTEZ_DEFAULT_BASE_URL = 'https://vntez-id.vercel.app';

export interface AuthorizeUrlParams {
  baseUrl?: string;
  clientId: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
  scope?: string;
}

export interface ExchangeTokenParams {
  baseUrl?: string;
  clientId: string;
  clientSecret?: string;
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

/**
 * Builds the VNTEZ ID OAuth 2.0 authorization URL with PKCE parameters
 */
export function buildAuthorizeUrl({
  baseUrl = VNTEZ_DEFAULT_BASE_URL,
  clientId,
  redirectUri,
  state,
  codeChallenge,
  scope = 'openid profile email',
}: AuthorizeUrlParams): string {
  if (!clientId) {
    throw new Error('VNTEZ OAuth: clientId is required');
  }
  if (!redirectUri) {
    throw new Error('VNTEZ OAuth: redirectUri is required');
  }

  const url = new URL('/oauth/authorize', baseUrl);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  if (scope) {
    url.searchParams.set('scope', scope);
  }

  return url.toString();
}

/**
 * Exchanges authorization code and code_verifier for an access_token
 * Endpoint: POST /oauth/token
 */
export async function exchangeToken({
  baseUrl = VNTEZ_DEFAULT_BASE_URL,
  clientId,
  clientSecret,
  code,
  codeVerifier,
  redirectUri,
}: ExchangeTokenParams): Promise<VntezTokenResponse> {
  const tokenUrl = new URL('/oauth/token', baseUrl).toString();

  const payload: Record<string, string> = {
    grant_type: 'authorization_code',
    code,
    client_id: clientId,
    code_verifier: codeVerifier,
    redirect_uri: redirectUri,
  };

  if (clientSecret) {
    payload.client_secret = clientSecret;
  }

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = errJson.error_description || errJson.error || JSON.stringify(errJson);
    } catch {
      errorDetail = await response.text();
    }
    throw new Error(`VNTEZ Token Exchange failed (${response.status}): ${errorDetail}`);
  }

  const data = (await response.json()) as VntezTokenResponse;
  if (!data.access_token) {
    throw new Error('VNTEZ Token Exchange did not return an access_token');
  }

  return data;
}

/**
 * Retrieves the authenticated user profile using the access token
 * Endpoint: GET /oauth/userinfo
 */
export async function fetchUserInfo(
  accessToken: string,
  baseUrl = VNTEZ_DEFAULT_BASE_URL
): Promise<VntezUser> {
  if (!accessToken) {
    throw new Error('Access token is required to fetch user info');
  }

  const userinfoUrl = new URL('/oauth/userinfo', baseUrl).toString();

  const response = await fetch(userinfoUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = errJson.error_description || errJson.error || JSON.stringify(errJson);
    } catch {
      errorDetail = await response.text();
    }
    throw new Error(`VNTEZ Userinfo request failed (${response.status}): ${errorDetail}`);
  }

  const user = (await response.json()) as VntezUser;
  if (!user.sub) {
    throw new Error('VNTEZ Userinfo response missing required "sub" field');
  }

  return user;
}
