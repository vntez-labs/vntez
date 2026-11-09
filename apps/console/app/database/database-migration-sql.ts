/**
 * VNTEZ Database Schema Migration Script (Supabase Postgres DDL)
 * Chia thành 2 đợt riêng biệt:
 * ĐỢT 1: Tạo các bảng cốt lõi (Tables), hàm RPC exec_sql và Seed dữ liệu
 * ĐỢT 2: Kích hoạt Row Level Security (RLS) & Policies an toàn (DROP IF EXISTS)
 */

export const PHASE_1_TABLES_SQL = `-- ==============================================================================
-- ĐỢT 1: TẠO BẢNG CỐT LÕI + RPC EXEC_SQL + SEED DATA (CHẠY ĐỢT 1 TRƯỚC)
-- ==============================================================================

-- 1. TẠO RPC EXEC_SQL (Giúp Console sau này tự chạy được DDL)
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
  RETURN json_build_object('success', true, 'message', 'Executed successfully');
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- 2. BẢNG PHÂN QUYỀN IAM ROLES & RBAC MATRIX
CREATE TABLE IF NOT EXISTS public.iam_roles (
  id TEXT PRIMARY KEY,
  app_id TEXT REFERENCES public.apps(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_iam_roles_app_id ON public.iam_roles(app_id);

CREATE TABLE IF NOT EXISTS public.iam_role_permissions (
  id BIGSERIAL PRIMARY KEY,
  role_id TEXT NOT NULL REFERENCES public.iam_roles(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (role_id, permission)
);

CREATE TABLE IF NOT EXISTS public.iam_user_roles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id TEXT NOT NULL REFERENCES public.iam_roles(id) ON DELETE CASCADE,
  app_id TEXT REFERENCES public.apps(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_iam_user_roles_app_id ON public.iam_user_roles(app_id);

-- 3. BẢNG TELEBOT SUBSCRIBERS (Quản lý Webhook & Người đăng ký Bot Telegram)
CREATE TABLE IF NOT EXISTS public.telebot_subscribers (
  chat_id BIGINT PRIMARY KEY,
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'pending')),
  tags TEXT[] DEFAULT '{all}',
  metadata JSONB DEFAULT '{}'::jsonb,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG APP REQUESTS (Chuẩn hóa từ oauth_client_requests)
CREATE TABLE IF NOT EXISTS public.app_requests (
  id TEXT PRIMARY KEY,
  app_name TEXT NOT NULL,
  team_email TEXT NOT NULL,
  redirect_uris TEXT[] DEFAULT '{}',
  url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG BLOG POSTS & RELATIONAL COMMENTS
CREATE TABLE IF NOT EXISTS public.blog_posts (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  read_time TEXT DEFAULT '5 phút đọc',
  comments_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  illustration_key TEXT DEFAULT 'ecosystem',
  thumbnail_url TEXT,
  status TEXT DEFAULT 'published',
  comments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blog_comments (
  id TEXT PRIMARY KEY,
  post_slug TEXT NOT NULL REFERENCES public.blog_posts(slug) ON DELETE CASCADE,
  parent_id TEXT,
  reply_to_author TEXT,
  author TEXT NOT NULL,
  avatar TEXT,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SEED DỮ LIỆU CÁC ROLES THẬT CỦA HỆ THỐNG (app_id IS NULL = Root/System)
INSERT INTO public.iam_roles (id, app_id, name, description) VALUES
  ('admin', NULL, 'Quản trị viên (Super Admin)', 'Toàn quyền kiểm soát mọi tài nguyên trên toàn hệ sinh thái'),
  ('developer', NULL, 'Lập trình viên (Developer)', 'Toàn quyền với Storage R2, TeleBot, Database và Apps; chỉ sửa hồ sơ cá nhân'),
  ('operator', NULL, 'Điều hành viên (Operator)', 'Vận hành Blog, TeleBot broadcast và xem thông tin tài khoản người dùng'),
  ('viewer', NULL, 'Người xem (Viewer)', 'Chỉ được xem thông tin công khai (Read-only)')
ON CONFLICT (id) DO UPDATE SET
  app_id = EXCLUDED.app_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Cấp quyền khởi tạo chuẩn theo 7 module thật
INSERT INTO public.iam_role_permissions (role_id, permission) VALUES
  ('admin', '*:*'),
  ('developer', 'apps:create'), ('developer', 'apps:read:all'), ('developer', 'apps:update:all'),
  ('developer', 'database:read:all'), ('developer', 'database:update:all'),
  ('developer', 'storage:create'), ('developer', 'storage:read:all'), ('developer', 'storage:update:all'),
  ('developer', 'telebot:create'), ('developer', 'telebot:read:all'),
  ('developer', 'users:read:self'), ('developer', 'users:update:self'), ('developer', 'blog:read:all'),
  ('operator', 'apps:read:all'), ('operator', 'blog:create'), ('operator', 'blog:read:all'),
  ('operator', 'blog:update:all'), ('operator', 'blog:delete:all'), ('operator', 'telebot:create'),
  ('operator', 'telebot:read:all'), ('operator', 'users:read:all'),
  ('viewer', 'apps:read:all'), ('viewer', 'blog:read:all'), ('viewer', 'users:read:self')
ON CONFLICT (role_id, permission) DO NOTHING;

-- Tự động gán quyền Super Admin cho tài khoản hnamhocit@gmail.com
INSERT INTO public.iam_user_roles (user_id, role_id, app_id)
SELECT id, 'admin', NULL FROM auth.users WHERE email = 'hnamhocit@gmail.com'
ON CONFLICT (user_id, role_id) DO NOTHING;`;

export const PHASE_2_RLS_POLICIES_SQL = `-- ==============================================================================
-- ĐỢT 2: KÍCH HOẠT ROW LEVEL SECURITY (RLS) & POLICIES AN TOÀN
-- (Dùng DROP POLICY IF EXISTS để không bao giờ bị lỗi 'already exists')
-- ==============================================================================

-- 1. BẬT RLS
ALTER TABLE public.iam_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iam_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iam_user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telebot_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- 2. POLICIES CHO IAM_ROLES
DROP POLICY IF EXISTS "Allow service role all on iam_roles" ON public.iam_roles;
CREATE POLICY "Allow service role all on iam_roles" ON public.iam_roles FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read iam_roles" ON public.iam_roles;
CREATE POLICY "Allow read iam_roles" ON public.iam_roles FOR SELECT TO authenticated, anon USING (true);

-- 3. POLICIES CHO IAM_ROLE_PERMISSIONS
DROP POLICY IF EXISTS "Allow service role all on iam_role_permissions" ON public.iam_role_permissions;
CREATE POLICY "Allow service role all on iam_role_permissions" ON public.iam_role_permissions FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read iam_role_permissions" ON public.iam_role_permissions;
CREATE POLICY "Allow read iam_role_permissions" ON public.iam_role_permissions FOR SELECT TO authenticated, anon USING (true);

-- 4. POLICIES CHO IAM_USER_ROLES
DROP POLICY IF EXISTS "Allow service role all on iam_user_roles" ON public.iam_user_roles;
CREATE POLICY "Allow service role all on iam_user_roles" ON public.iam_user_roles FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read iam_user_roles" ON public.iam_user_roles;
CREATE POLICY "Allow read iam_user_roles" ON public.iam_user_roles FOR SELECT TO authenticated USING (true);

-- 5. POLICIES CHO TELEBOT_SUBSCRIBERS
DROP POLICY IF EXISTS "Allow service role all on telebot_subscribers" ON public.telebot_subscribers;
CREATE POLICY "Allow service role all on telebot_subscribers" ON public.telebot_subscribers FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read telebot_subscribers" ON public.telebot_subscribers;
CREATE POLICY "Allow read telebot_subscribers" ON public.telebot_subscribers FOR SELECT TO authenticated USING (true);

-- 6. POLICIES CHO APP_REQUESTS
DROP POLICY IF EXISTS "Allow all on app_requests" ON public.app_requests;
CREATE POLICY "Allow all on app_requests" ON public.app_requests FOR ALL USING (true) WITH CHECK (true);

-- 7. POLICIES CHO BLOG_POSTS & BLOG_COMMENTS
DROP POLICY IF EXISTS "Allow public read blog_posts" ON public.blog_posts;
CREATE POLICY "Allow public read blog_posts" ON public.blog_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all blog_posts" ON public.blog_posts;
CREATE POLICY "Allow all blog_posts" ON public.blog_posts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read blog_comments" ON public.blog_comments;
CREATE POLICY "Allow public read blog_comments" ON public.blog_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all blog_comments" ON public.blog_comments;
CREATE POLICY "Allow all blog_comments" ON public.blog_comments FOR ALL USING (true) WITH CHECK (true);`;

export const MIGRATION_SQL = `${PHASE_1_TABLES_SQL}\n\n${PHASE_2_RLS_POLICIES_SQL}`;
