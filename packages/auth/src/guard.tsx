/**
 * Client-Side AuthGuard Component
 * Enforces authentication on client rendered routes using the Zustand Auth Store
 */

'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from './store';

export interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  redirectTo = '/login',
  fallback,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, status } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && status !== 'loading') {
      const currentPath =
        typeof window !== 'undefined'
          ? window.location.pathname + window.location.search
          : '';
      const target = currentPath && currentPath !== '/' && currentPath !== redirectTo
        ? `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`
        : redirectTo;

      window.location.href = target;
    }
  }, [isLoading, isAuthenticated, status, redirectTo]);

  if (isLoading || !isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-muted border-t-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold tracking-wide text-foreground uppercase">
              Xác thực phiên bảo mật
            </p>
            <p className="text-xs text-muted-foreground">
              Đang kiểm tra chứng chỉ VNTEZ ID OAuth 2.0 PKCE...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
