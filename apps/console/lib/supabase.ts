import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://stbswcnsitztbusqrdhi.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "sb_publishable_Pjw68YY4m28WZaTUgiT17A_LZUhMGLx";

export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Standard Supabase client using publishable key
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Server-side Admin Supabase client.
 * Uses SUPABASE_SERVICE_ROLE_KEY if configured in environment, otherwise falls back to SUPABASE_PUBLISHABLE_KEY.
 *
 * NOTE: External SSO tokens (like VNTEZ ID OAuth tokens) must NOT be passed to Supabase
 * in the Authorization Bearer header, because Supabase PostgREST validates tokens with
 * its own internal JWT secret.
 */
export function getSupabaseAdminClient() {
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY;
  const key = serviceKey || SUPABASE_PUBLISHABLE_KEY;
  return createClient(SUPABASE_URL, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Backwards-compatible export
export const getSupabaseClient = getSupabaseAdminClient;
