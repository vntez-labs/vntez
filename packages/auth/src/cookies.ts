/**
 * Security Cookie Names and Configuration for VNTEZ IAM OAuth 2.0 PKCE
 */

export const COOKIE_NAMES = {
  CODE_VERIFIER: 'vntez_code_verifier',
  STATE: 'vntez_oauth_state',
  ACCESS_TOKEN: 'vntez_access_token',
  REFRESH_TOKEN: 'vntez_refresh_token',
  USER_SESSION: 'vntez_user_session',
  REDIRECT_TARGET: 'vntez_auth_redirect',
} as const;

export const DEFAULT_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  domain: process.env.COOKIE_DOMAIN || undefined,
};

/**
 * 5-minute lifespan for transient OAuth state and code_verifier cookies
 */
export const PKCE_COOKIE_MAX_AGE = 5 * 60; // 300 seconds

/**
 * Default persistent session lifespan (30 days) for seamless long-lived logins
 */
export const DEFAULT_SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days (2,592,000s)
