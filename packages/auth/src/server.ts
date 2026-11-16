/**
 * Server-Side Session Handlers for Next.js App Router
 */

import { cookies } from 'next/headers';
import { COOKIE_NAMES, DEFAULT_COOKIE_OPTIONS, DEFAULT_SESSION_MAX_AGE } from './cookies';
import { fixVietnameseEncoding } from './encoding';
import type { VntezUser } from './types';

/**
 * Retrieve current user session from cookies
 */
export async function getServerSession(): Promise<{
  user: VntezUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value || null;
    const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value || null;
    const sessionCookie = cookieStore.get(COOKIE_NAMES.USER_SESSION)?.value;

    if (!sessionCookie) {
      return { user: null, accessToken: null, refreshToken: null };
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

    return { user, accessToken: token, refreshToken };
  } catch {
    return { user: null, accessToken: null, refreshToken: null };
  }
}

/**
 * Refresh (slide) the persistent user session cookie for another 30 days
 */
export async function refreshServerSessionCookie(user?: VntezUser): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAMES.USER_SESSION)?.value;
  if (!sessionCookie && !user) return;

  let sessionData = user;
  if (!sessionData && sessionCookie) {
    try {
      sessionData = JSON.parse(decodeURIComponent(sessionCookie));
    } catch {}
  }

  if (sessionData) {
    cookieStore.set(COOKIE_NAMES.USER_SESSION, encodeURIComponent(JSON.stringify(sessionData)), {
      ...DEFAULT_COOKIE_OPTIONS,
      maxAge: DEFAULT_SESSION_MAX_AGE,
    });
  }
}

/**
 * Update current user session cookie
 */
export async function updateServerSessionUser(updatedUser: VntezUser): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAMES.USER_SESSION, encodeURIComponent(JSON.stringify(updatedUser)), {
    ...DEFAULT_COOKIE_OPTIONS,
    maxAge: DEFAULT_SESSION_MAX_AGE,
  });
}

/**
 * Clear all authentication session cookies
 */
export async function clearServerSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
  cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
  cookieStore.delete(COOKIE_NAMES.USER_SESSION);
  cookieStore.delete(COOKIE_NAMES.CODE_VERIFIER);
  cookieStore.delete(COOKIE_NAMES.STATE);
  cookieStore.delete(COOKIE_NAMES.REDIRECT_TARGET);
}
