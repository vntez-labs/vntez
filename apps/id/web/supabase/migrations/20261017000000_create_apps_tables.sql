-- =========================================================
-- 1. BẢNG SYSTEM_APPS (Ứng dụng mặc định của hệ thống)
-- =========================================================
create table if not exists public.system_apps (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  url text not null,
  icon_url text,
  is_pinned boolean default false not null,
  dock_order integer default 0 not null,
  grid_col integer,
  grid_row integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Nếu bảng đã tồn tại từ trước, bổ sung các cột còn thiếu
alter table public.system_apps
  add column if not exists is_pinned boolean default false not null,
  add column if not exists dock_order integer default 0 not null,
  add column if not exists grid_col integer,
  add column if not exists grid_row integer;

-- Bật Row Level Security (RLS)
alter table public.system_apps enable row level security;

-- Policy: Tất cả người dùng (kể cả khách / đã đăng nhập) đều được xem danh sách
drop policy if exists "Anyone can view system apps" on public.system_apps;
create policy "Anyone can view system apps"
  on public.system_apps
  for select
  using (true);

-- Chèn hoặc cập nhật 4 ứng dụng hệ thống mặc định
insert into public.system_apps (name, url, icon_url, is_pinned, dock_order, grid_col, grid_row)
select name, url, icon_url, is_pinned, dock_order, grid_col, grid_row from (
  values
    ('Pomoduo', 'https://pomoduo.povixa.cloud', null, true, 0, null::integer, null::integer),
    ('Bonsai Reader', 'https://bonsai-reader.povixa.cloud', null, true, 1, null::integer, null::integer),
    ('Lexis Vault', 'https://lexis.povixa.cloud', null, false, 0, 0, 2),
    ('Notes', 'https://notes.povixa.cloud', null, false, 0, 0, 3)
) as v(name, url, icon_url, is_pinned, dock_order, grid_col, grid_row)
where not exists (
  select 1 from public.system_apps s where s.url = v.url
);

-- Cập nhật lại tọa độ và dock cho các app nếu đã tồn tại sẵn
update public.system_apps
set is_pinned = true, dock_order = 0, grid_col = null, grid_row = null
where url like '%pomoduo%';

update public.system_apps
set is_pinned = true, dock_order = 1, grid_col = null, grid_row = null
where url like '%bonsai%';

update public.system_apps
set is_pinned = false, dock_order = 0, grid_col = 0, grid_row = 2
where url like '%lexis%';

update public.system_apps
set is_pinned = false, dock_order = 0, grid_col = 0, grid_row = 3
where url like '%notes%';

-- =========================================================
-- 2. BẢNG USER_APPS (Ứng dụng cá nhân của từng user)
-- =========================================================
create table if not exists public.user_apps (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  url text not null,
  icon_url text,
  is_pinned boolean default false not null,
  dock_order integer default 0 not null,
  grid_col integer default 0,
  grid_row integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Nếu bảng đã tồn tại từ trước, bổ sung các cột còn thiếu
alter table public.user_apps
  add column if not exists is_pinned boolean default false not null,
  add column if not exists dock_order integer default 0 not null,
  add column if not exists grid_col integer default 0,
  add column if not exists grid_row integer default 0;

-- Index Foreign Key user_id để tối ưu hiệu năng JOIN và RLS filter
create index if not exists user_apps_user_id_idx on public.user_apps (user_id);

-- Bật Row Level Security (RLS)
alter table public.user_apps enable row level security;

-- Policy: User chỉ xem, thêm, sửa, xóa app của chính mình
-- Dùng (select auth.uid()) để query plan được cache, tối ưu tốc độ 5-10x
drop policy if exists "Users manage own apps" on public.user_apps;
create policy "Users manage own apps"
  on public.user_apps
  for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
