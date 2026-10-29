/**
 * Zustand Auth Store for Client-side Auth State Management
 */

'use client';

import { create } from 'zustand';
import type { AuthState, VntezUser } from './types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  status: 'loading',
  isLoading: true,
  isAuthenticated: false,
  error: null,

  setUser: (user: VntezUser | null) =>
    set({
      user,
      isAuthenticated: !!user,
      status: user ? 'authenticated' : 'unauthenticated',
      isLoading: false,
    }),

  setToken: (accessToken: string | null) => set({ accessToken }),

  setAuthenticated: (user: VntezUser, accessToken?: string) =>
    set({
      user,
      accessToken: accessToken ?? null,
      status: 'authenticated',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    }),

  setUnauthenticated: () =>
    set({
      user: null,
      accessToken: null,
      status: 'unauthenticated',
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }),

  setError: (error: string | null) =>
    set({
      error,
      isLoading: false,
    }),

  logout: async () => {
    try {
      set({ status: 'loading', isLoading: true });
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      set({
        user: null,
        accessToken: null,
        status: 'unauthenticated',
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },
}));
