/**
 * Security Cookie Names and Configuration for VNTEZ ID OAuth 2.0 PKCE
 */

export const COOKIE_NAMES = {
  CODE_VERIFIER: 'vntez_code_verifier',
  STATE: 'vntez_oauth_state',
  ACCESS_TOKEN: 'vntez_access_token',
  USER_SESSION: 'vntez_user_session',
  REDIRECT_TARGET: 'vntez_auth_redirect',
} as const;

export const DEFAULT_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

/**
 * 5-minute lifespan for transient OAuth state and code_verifier cookies
 */
export const PKCE_COOKIE_MAX_AGE = 5 * 60; // 300 seconds

/**
 * Default session lifespan (7 days) if token expires_in is not specified
 */
export const DEFAULT_SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days
