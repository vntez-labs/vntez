"use client";

import React, { useState } from "react";
import { X, Copy, Check, ExternalLink, Database } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface DatabaseSqlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MIGRATION_SQL = `-- 1. APPS TABLE (Consolidated Apps & OAuth Clients)
CREATE TABLE IF NOT EXISTS public.apps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT DEFAULT NULL, -- Live website URL (hoặc NULL)
  release_date TEXT,
  platforms TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  illustration_key TEXT DEFAULT 'ecosystem',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. APP REQUESTS TABLE (Đổi tên & chuẩn hóa từ oauth_client_requests)
CREATE TABLE IF NOT EXISTS public.app_requests (
  id TEXT PRIMARY KEY,
  app_name TEXT NOT NULL,
  team_email TEXT NOT NULL,
  redirect_uris TEXT[] DEFAULT '{}',
  url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BLOG POSTS TABLE
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

-- 4. RELATIONAL BLOG COMMENTS TABLE
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

-- 5. MIGRATION NÂNG CẤP DỮ LIỆU HIỆN CÓ:
-- ALTER TABLE public.apps ADD COLUMN IF NOT EXISTS url TEXT;
-- ALTER TABLE public.apps DROP COLUMN IF EXISTS category;
-- ALTER TABLE public.apps DROP COLUMN IF EXISTS cta_link;
-- ALTER TABLE public.apps DROP COLUMN IF EXISTS color;
-- ALTER TABLE IF EXISTS public.oauth_client_requests RENAME TO app_requests;
-- DROP TABLE IF EXISTS public.oauth_clients;
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS POLICIES FOR PUBLIC READ & AUTHENTICATED ACCESS
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read apps" ON public.apps FOR SELECT USING (true);
CREATE POLICY "Allow public read blog_posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read blog_comments" ON public.blog_comments FOR SELECT USING (true);

CREATE POLICY "Allow all apps" ON public.apps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all blog_posts" ON public.blog_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all blog_comments" ON public.blog_comments FOR ALL USING (true) WITH CHECK (true);`;

export function DatabaseSqlModal({ isOpen, onClose }: DatabaseSqlModalProps) {
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(MIGRATION_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <Database className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-display font-bold text-base text-foreground">
                SQL Khởi tạo Bảng (Apps, Blog & Comments)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Chạy script này trong Supabase SQL Editor để kích hoạt các bảng quan hệ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="relative rounded-2xl bg-zinc-950 p-4 border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-[420px]">
            <pre>{MIGRATION_SQL}</pre>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 sm:px-6 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-wrap items-center justify-between gap-3">
          <a
            href="https://supabase.com/dashboard/project/stbswcnsitztbusqrdhi/sql/new"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
          >
            <span>Mở Supabase SQL Editor</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="rounded-xl text-xs font-semibold gap-1.5 cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Đã sao chép!" : "Sao chép mã SQL"}</span>
            </Button>
            <Button type="button" size="sm" onClick={onClose} className="rounded-xl text-xs font-semibold">
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
