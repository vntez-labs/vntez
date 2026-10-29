-- Migration: Create public.oauth_client_requests table for partner deals & client applications
-- Execute this SQL in Supabase Studio: https://supabase.com/dashboard/project/stbswcnsitztbusqrdhi/sql/new

CREATE TABLE IF NOT EXISTS public.oauth_client_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  identity_proof TEXT,
  project_name TEXT NOT NULL,
  project_idea TEXT NOT NULL,
  project_website TEXT,
  requested_redirect_uris TEXT[] NOT NULL DEFAULT '{}',
  deal_type TEXT DEFAULT 'partner',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' (Chờ duyệt), 'approved' (Đã duyệt), 'rejected' (Từ chối)
  admin_notes TEXT,
  approved_client_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.oauth_client_requests ENABLE ROW LEVEL SECURITY;

-- Allow Service Role to have full admin access
CREATE POLICY "Service Role Full Access on oauth_client_requests" 
  ON public.oauth_client_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to view their own requests
CREATE POLICY "Users can view own requests" 
  ON public.oauth_client_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = applicant_email);

-- Allow authenticated users to insert their own requests
CREATE POLICY "Users can insert own requests" 
  ON public.oauth_client_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = applicant_email);
