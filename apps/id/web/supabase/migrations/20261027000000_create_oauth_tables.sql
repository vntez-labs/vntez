-- =========================================================
-- VNTEZ ID - BẢNG QUẢN LÝ OAUTH 2.0 & IDENTITY PROVIDER
-- =========================================================

-- 1. Bảng quản lý ứng dụng client (Client Apps)
create table if not exists public.oauth_clients (
  client_id text primary key,
  client_secret_hash text, -- NULL nếu là Public Client (SPA, Mobile) chỉ dùng PKCE
  name text not null,
  redirect_uris text[] not null,
  logo_url text,
  description text,
  is_internal boolean default false,
  created_at timestamptz default now()
);

-- Bổ sung các cột nếu bảng đã được tạo trước đó
alter table public.oauth_clients
  add column if not exists logo_url text,
  add column if not exists description text,
  add column if not exists is_internal boolean default false;

-- 2. Bảng lưu auth code tạm thời (hết hạn sau 5-10 phút)
create table if not exists public.oauth_codes (
  code text primary key,
  client_id text references public.oauth_clients(client_id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  code_challenge text,
  code_challenge_method text default 'S256',
  redirect_uri text not null,
  expires_at timestamptz not null,
  used boolean default false,
  created_at timestamptz default now()
);

-- Index tăng tốc truy vấn khi đổi code lấy token
create index if not exists idx_oauth_codes_lookup on public.oauth_codes (code, used, expires_at);

-- 3. Row Level Security (RLS)
alter table public.oauth_clients enable row level security;
alter table public.oauth_codes enable row level security;

-- Policy cho oauth_clients
drop policy if exists "Allow public read oauth_clients" on public.oauth_clients;
create policy "Allow public read oauth_clients"
  on public.oauth_clients
  for select
  using (true);

drop policy if exists "Allow insert oauth_clients" on public.oauth_clients;
create policy "Allow insert oauth_clients"
  on public.oauth_clients
  for insert
  with check (true);

drop policy if exists "Allow update oauth_clients" on public.oauth_clients;
create policy "Allow update oauth_clients"
  on public.oauth_clients
  for update
  using (true);

drop policy if exists "Allow delete oauth_clients" on public.oauth_clients;
create policy "Allow delete oauth_clients"
  on public.oauth_clients
  for delete
  using (true);

-- Policy cho oauth_codes
drop policy if exists "Allow select oauth_codes" on public.oauth_codes;
create policy "Allow select oauth_codes"
  on public.oauth_codes
  for select
  using (true);

drop policy if exists "Allow insert oauth_codes" on public.oauth_codes;
create policy "Allow insert oauth_codes"
  on public.oauth_codes
  for insert
  with check (true);

drop policy if exists "Allow update oauth_codes" on public.oauth_codes;
create policy "Allow update oauth_codes"
  on public.oauth_codes
  for update
  using (true);

-- 4. Khởi tạo ứng dụng mặc định cho hệ sinh thái VNTEZ
insert into public.oauth_clients (client_id, client_secret_hash, name, redirect_uris, is_internal)
values (
  'vntez-console-app',
  null,
  'VNTEZ Console',
  array['http://localhost:3000/auth/callback', 'https://vntez-console.vercel.app/auth/callback'],
  true
),
(
  'vntez_c18f43a315d368109d4d8aca',
  null,
  'BMAN',
  array['vntez-bman://auth/callback'],
  true
),
(
  'vntez-demo-client',
  null,
  'VNTEZ Playground & Demo App',
  array['http://localhost:3000/oauth/tester/callback', 'https://vntez-id.vercel.app/oauth/tester/callback'],
  true
)
on conflict (client_id) do nothing;

-- 5. Làm mới PostgREST schema cache
notify pgrst, 'reload schema';
