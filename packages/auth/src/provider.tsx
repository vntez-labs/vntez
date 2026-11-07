/**
 * AuthProvider component
 * Hydrates Zustand store with initial server session and maintains client sync
 */

'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from './store';
import type { VntezUser } from './types';

export interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: VntezUser | null;
  initialToken?: string | null;
}

export function AuthProvider({ children, initialUser, initialToken }: AuthProviderProps) {
  const initialized = useRef(false);
  const { setAuthenticated, setUnauthenticated } = useAuthStore();

  const syncSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: { credentials: 'include' },
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setAuthenticated(data.user, data.accessToken);
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }, [setAuthenticated]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      if (initialUser) {
        setAuthenticated(initialUser, initialToken ?? undefined);
      } else {
        syncSession().then((ok) => {
          if (!ok) setUnauthenticated();
        });
      }
    }

    // 1. Sliding session & auto-refresh on tab visibility / window focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncSession();
      }
    };
    const handleFocus = () => {
      syncSession();
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // 2. Periodic background keep-alive heartbeat (every 10 minutes)
    const intervalId = setInterval(() => {
      syncSession();
    }, 10 * 60 * 1000);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, [initialUser, initialToken, setAuthenticated, setUnauthenticated, syncSession]);

  return <>{children}</>;
}
