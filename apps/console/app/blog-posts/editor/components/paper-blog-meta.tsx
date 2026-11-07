"use client";

import React from "react";
import { Upload, X, Clock } from "lucide-react";
import { AutoResizeTextarea } from "@workspace/ui/components/auto-resize-textarea";
import { CustomSelect } from "@workspace/ui/components/custom-select";
import type { BlogPostItem } from "@workspace/ui/lib/content-types";

const BLOG_STATUS_OPTIONS = [
  { value: "published", label: "Xuất bản Công khai" },
  { value: "draft", label: "Bản nháp nội bộ" },
];

const AUTHOR_OPTIONS = [
  { value: "Core Engineering Team", label: "Core Engineering Team", description: "Đội ngũ Kỹ thuật Cốt lõi" },
  { value: "Product & Architecture", label: "Product & Architecture", description: "Sản phẩm & Kiến trúc Hệ thống" },
  { value: "Infrastructure & DevOps", label: "Infrastructure & DevOps", description: "Hạ tầng Cloud & Vận hành" },
  { value: "Security & IAM Team", label: "Security & IAM Team", description: "Bảo mật & Định danh Phân quyền" },
  { value: "Founders & Leadership", label: "Founders & Leadership", description: "Ban Sáng lập & Định hướng" },
  { value: "Developer Relations", label: "Developer Relations", description: "Cộng đồng Lập trình viên" },
  { value: "Data & AI Research", label: "Data & AI Research", description: "Nghiên cứu Dữ liệu & AI" },
];

interface PaperBlogMetaProps {
  title: string;
  setTitle: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  excerpt: string;
  setExcerpt: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  author: string;
  setAuthor: (val: string) => void;
  readTime: string;
  setReadTime: (val: string) => void;
  status: "published" | "draft";
  setStatus: (val: "published" | "draft") => void;
  illustrationKey: BlogPostItem["illustrationKey"];
  setIllustrationKey: (val: BlogPostItem["illustrationKey"]) => void;
  thumbnailUrl: string;
  setThumbnailUrl: (val: string) => void;
  isUploading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEdit: boolean;
}

export function PaperBlogMeta({
  title,
  setTitle,
  slug,
  setSlug,
  excerpt,
  setExcerpt,
  category,
  setCategory,
  author,
  setAuthor,
  readTime,
  setReadTime,
  status,
  setStatus,
  illustrationKey,
  setIllustrationKey,
  thumbnailUrl,
  setThumbnailUrl,
  isUploading,
  onFileUpload,
  isEdit,
}: PaperBlogMetaProps) {
  return (
    <div className="space-y-8">
      {/* 1. Large Document Headline Title */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
          Tiêu đề Bài viết
        </label>
        <input
          type="text"
          placeholder="Nhập tiêu đề bài viết phân tích hoặc kỹ thuật..."
          value={title}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          onChange={(e) => {
            setTitle(e.target.value);
            if (!isEdit) {
              const autoSlug = e.target.value
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
              setSlug(autoSlug);
            }
          }}
          className="w-full text-2xl sm:text-4xl font-extrabold tracking-tight font-display bg-transparent border-0 border-b border-zinc-200/80 dark:border-zinc-800 pb-3 focus:outline-none focus:border-primary placeholder:text-zinc-300 dark:placeholder:text-zinc-700 text-foreground transition-colors"
        />
      </div>

      {/* 2. Slug, Category, Author, Read Time Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-1">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Đường dẫn Slug
          </label>
          <input
            type="text"
            placeholder="duong-dan-bai-viet"
            value={slug}
            disabled={isEdit}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            onChange={(e) => setSlug(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-zinc-200/80 dark:border-zinc-800 focus:border-primary px-0 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Chủ đề / Danh mục
          </label>
          <input
            type="text"
            placeholder="Kiến trúc hệ thống, Bảo mật..."
            value={category}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-zinc-200/80 dark:border-zinc-800 focus:border-primary px-0 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Tác giả / Nhóm
          </label>
          <CustomSelect
            value={author || "Core Engineering Team"}
            onChange={(val) => setAuthor(val)}
            options={AUTHOR_OPTIONS}
            placeholder="Chọn nhóm tác giả..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Thời lượng đọc
          </label>
          <div className="flex items-center gap-2 py-2 border-0 border-b border-zinc-200/80 dark:border-zinc-800 text-xs">
            <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="font-semibold text-foreground font-mono">
              {readTime || "1 phút đọc"}
            </span>
            <span className="text-[10px] text-muted-foreground">
              (Tự động tính)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Auto-Resize Excerpt Textarea */}
      <div className="space-y-3 pt-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
          Tóm tắt nội dung (Excerpt)
        </label>
        <AutoResizeTextarea
          minRows={2}
          placeholder="Tóm tắt ngắn gọn luận điểm chính của bài viết để hiển thị trên thẻ xem trước..."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="text-sm leading-relaxed border-b border-zinc-200/80 dark:border-zinc-800 pb-2 focus:border-primary"
        />
      </div>

      {/* 4. Thumbnail & Fallback Illustration & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-1">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Ảnh bìa Thumbnail
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors shrink-0">
              <Upload className="h-3.5 w-3.5 text-primary" />
              <span>{isUploading ? "Đang tải ảnh..." : "Chọn ảnh từ máy"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={onFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Hoặc dán URL ảnh bìa trực tiếp..."
                value={thumbnailUrl}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-zinc-200/80 dark:border-zinc-800 focus:border-primary px-0 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors"
              />
              {thumbnailUrl && (
                <button
                  type="button"
                  onClick={() => setThumbnailUrl("")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-rose-500 hover:text-rose-600 p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Trạng thái xuất bản
          </label>
          <CustomSelect
            value={status}
            onChange={(val) => setStatus(val as "published" | "draft")}
            options={BLOG_STATUS_OPTIONS}
          />
        </div>
      </div>
    </div>
  );
}
