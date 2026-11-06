-- Migration: Create apps and blog_posts tables for VNTEZ ecosystem
-- Execute in Supabase Studio: https://supabase.com/dashboard/project/stbswcnsitztbusqrdhi/sql/new

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

-- Public read access
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read apps" ON public.apps FOR SELECT USING (true);
CREATE POLICY "Allow public read blog_posts" ON public.blog_posts FOR SELECT USING (true);
