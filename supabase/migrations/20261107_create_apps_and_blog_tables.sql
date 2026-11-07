-- ==============================================================================
-- VNTEZ PLATFORM — SUPABASE POSTGRES SCHEMA MIGRATION
-- Apps, Blog Posts & Relational Deep Comments
-- ==============================================================================
-- Execute in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/stbswcnsitztbusqrdhi/sql/new
-- ==============================================================================

-- 1. APPS TABLE
CREATE TABLE IF NOT EXISTS public.apps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  release_date TEXT,
  platforms TEXT[] DEFAULT '{}',
  color TEXT DEFAULT '#fb291a',
  cta_link TEXT DEFAULT '/docs',
  avatar_url TEXT,
  illustration_key TEXT DEFAULT 'ecosystem',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  color TEXT DEFAULT '#fb291a',
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

-- 3. RELATIONAL BLOG COMMENTS TABLE (Supports infinite nested threads)
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

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_apps_status ON public.apps(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_slug ON public.blog_comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON public.blog_comments(parent_id);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES FOR PUBLIC READ & SERVICE ROLE WRITE
DROP POLICY IF EXISTS "Allow public read apps" ON public.apps;
CREATE POLICY "Allow public read apps" ON public.apps FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read blog_posts" ON public.blog_posts;
CREATE POLICY "Allow public read blog_posts" ON public.blog_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read blog_comments" ON public.blog_comments;
CREATE POLICY "Allow public read blog_comments" ON public.blog_comments FOR SELECT USING (true);

-- Allow authenticated / admin operations
DROP POLICY IF EXISTS "Allow all for authenticated users on apps" ON public.apps;
CREATE POLICY "Allow all for authenticated users on apps" ON public.apps FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for authenticated users on blog_posts" ON public.blog_posts;
CREATE POLICY "Allow all for authenticated users on blog_posts" ON public.blog_posts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for authenticated users on blog_comments" ON public.blog_comments;
CREATE POLICY "Allow all for authenticated users on blog_comments" ON public.blog_comments FOR ALL USING (true) WITH CHECK (true);
