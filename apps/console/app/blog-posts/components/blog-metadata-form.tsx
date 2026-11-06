"use client";

import React from "react";
import { Upload } from "lucide-react";

interface BlogMetadataFormProps {
  title: string;
  setTitle: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  author: string;
  setAuthor: (val: string) => void;
  readTime: string;
  setReadTime: (val: string) => void;
  status: "published" | "draft";
  setStatus: (val: "published" | "draft") => void;
  viewsCount: number;
  setViewsCount: (val: number) => void;
  likesCount: number;
  setLikesCount: (val: number) => void;
  thumbnailUrl: string;
  setThumbnailUrl: (val: string) => void;
  excerpt: string;
  setExcerpt: (val: string) => void;
  isUploading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEdit: boolean;
}

export function BlogMetadataForm({
  title,
  setTitle,
  slug,
  setSlug,
  category,
  setCategory,
  author,
  setAuthor,
  readTime,
  setReadTime,
  status,
  setStatus,
  viewsCount,
  setViewsCount,
  likesCount,
  setLikesCount,
  thumbnailUrl,
  setThumbnailUrl,
  excerpt,
  setExcerpt,
  isUploading,
  onFileUpload,
  isEdit,
}: BlogMetadataFormProps) {
  return (
    <div className="space-y-3.5 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="font-semibold text-foreground">Tiêu đề bài viết *</label>
          <input
            type="text"
            required
            placeholder="Tiêu đề bài viết..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!isEdit) {
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
              }
            }}
            className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 px-3 py-2 text-xs text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800"
          />
        </div>
        <div className="space-y-1">
          <label className="font-semibold text-foreground">Slug đường dẫn *</label>
          <input
            type="text"
            required
            placeholder="slug-bai-viet"
            value={slug}
            disabled={isEdit}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 px-3 py-2 text-xs text-foreground font-mono ring-1 ring-zinc-200/80 dark:ring-zinc-800 disabled:opacity-60"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="space-y-1">
          <label className="font-semibold text-foreground">Thể loại</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 px-2.5 py-1.5 text-xs text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800"
          />
        </div>
        <div className="space-y-1">
          <label className="font-semibold text-foreground">Tác giả</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 px-2.5 py-1.5 text-xs text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800"
          />
        </div>
        <div className="space-y-1">
          <label className="font-semibold text-foreground">Thời gian đọc</label>
          <input
            type="text"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 px-2.5 py-1.5 text-xs text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800"
          />
        </div>
        <div className="space-y-1">
          <label className="font-semibold text-foreground">Trạng thái</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "published" | "draft")}
            className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 px-2.5 py-1.5 text-xs text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800"
          >
            <option value="published">Xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/30">
        <div className="space-y-1">
          <label className="font-semibold text-foreground">Lượt xem</label>
          <input
            type="number"
            min={0}
            value={viewsCount}
            onChange={(e) => setViewsCount(Number(e.target.value))}
            className="w-full rounded-lg bg-white dark:bg-card px-2.5 py-1 text-xs text-foreground font-mono ring-1 ring-zinc-200 dark:ring-zinc-800"
          />
        </div>
        <div className="space-y-1">
          <label className="font-semibold text-foreground">Lượt tim</label>
          <input
            type="number"
            min={0}
            value={likesCount}
            onChange={(e) => setLikesCount(Number(e.target.value))}
            className="w-full rounded-lg bg-white dark:bg-card px-2.5 py-1 text-xs text-foreground font-mono ring-1 ring-zinc-200 dark:ring-zinc-800"
          />
        </div>
        <div className="sm:col-span-2 space-y-1">
          <label className="font-semibold text-foreground">Ảnh Thumbnail</label>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-white dark:bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-2xs hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <Upload className="h-3.5 w-3.5 text-primary" />
              <span>{isUploading ? "Tải..." : "Tải ảnh"}</span>
              <input type="file" accept="image/*" onChange={onFileUpload} disabled={isUploading} className="hidden" />
            </label>
            <input
              type="text"
              placeholder="Hoặc URL ảnh..."
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="flex-1 rounded-lg bg-white dark:bg-card px-2.5 py-1 text-xs text-foreground ring-1 ring-zinc-200 dark:ring-zinc-800"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="font-semibold text-foreground">Tóm tắt ngắn (Excerpt)</label>
        <textarea
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 p-2.5 text-xs text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800 resize-none"
        />
      </div>
    </div>
  );
}
