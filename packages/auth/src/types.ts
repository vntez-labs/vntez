/**
 * VNTEZ ID OAuth 2.0 PKCE Data Types & Interfaces
 * RFC 7636 & RFC 6749
 */

export interface VntezUser {
  sub: string;
  email: string;
  name: string;
  avatar?: string;
  [key: string]: unknown;
}

export interface VntezTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

export interface PKCECodes {
  codeVerifier: string;
  codeChallenge: string;
  state: string;
}

export interface AuthConfig {
  clientId: string;
  redirectUri: string;
  baseUrl?: string;
  clientSecret?: string;
}

export interface AuthSession {
  user: VntezUser;
  accessToken: string;
  expiresAt: number;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  user: VntezUser | null;
  accessToken: string | null;
  status: AuthStatus;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  setUser: (user: VntezUser | null) => void;
  setToken: (token: string | null) => void;
  setAuthenticated: (user: VntezUser, token?: string) => void;
  setUnauthenticated: () => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
}
