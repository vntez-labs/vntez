"use client";

import React, { useState } from "react";
import { IconPlus, IconX, IconFileCode } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import type { AppDocPage } from "@workspace/ui/lib/content-types";

interface CreateDocPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPage: (page: AppDocPage) => void;
}

export function CreateDocPageModal({ isOpen, onClose, onAddPage }: CreateDocPageModalProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Hướng dẫn");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Tiêu đề trang không được để trống");
      return;
    }

    const cleanSlug = (slug.trim() || title.trim())
      .toLowerCase()
      .replace(/[^a-z0-9\-_/]+/g, "-")
      .replace(/^-|-$/g, "");

    onAddPage({
      slug: cleanSlug,
      title: title.trim(),
      category: category.trim() || "Chung",
      content: `# ${title.trim()}\n\nNội dung tài liệu kỹ thuật cho trang ${title.trim()}.\n\n## 1. Hướng dẫn\nNhập nội dung MDX tại đây.\n`,
      updatedAt: new Date().toISOString(),
    });

    setTitle("");
    setSlug("");
    setCategory("Hướng dẫn");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0c121e] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <IconFileCode className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold font-display text-foreground">
              Thêm Trang Tài Liệu Mới (MDX)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tiêu đề Trang
            </label>
            <input
              type="text"
              placeholder="ví dụ: Hướng dẫn Xác thực OAuth"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-primary"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Đường dẫn Slug (Tùy chọn)
            </label>
            <input
              type="text"
              placeholder="auth-guide"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-primary font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Danh mục Phân nhóm
            </label>
            <input
              type="text"
              placeholder="Cơ bản / Nâng cao / API"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 px-3 text-xs rounded-xl cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 px-4 text-xs font-semibold rounded-xl cursor-pointer"
            >
              <IconPlus className="h-3.5 w-3.5 mr-1" />
              Tạo trang
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
