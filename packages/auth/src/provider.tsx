/**
 * AuthProvider component
 * Hydrates Zustand store with initial server session and maintains client sync
 */

'use client';

import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (initialUser) {
      setAuthenticated(initialUser, initialToken ?? undefined);
      return;
    }

    // Hydrate from /api/auth/me if not pre-rendered from server
    let isMounted = true;
    async function checkCurrentSession() {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          headers: { credentials: 'include' },
          cache: 'no-store',
        });

        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setAuthenticated(data.user, data.accessToken);
            return;
          }
        }
        setUnauthenticated();
      } catch {
        if (isMounted) {
          setUnauthenticated();
        }
      }
    }

    checkCurrentSession();

    return () => {
      isMounted = false;
    };
  }, [initialUser, initialToken, setAuthenticated, setUnauthenticated]);

  return <>{children}</>;
}
