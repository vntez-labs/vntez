"use client";

import React, { useState } from "react";
import { IconPlus, IconX, IconScale } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import type { AppLegalDocument } from "@workspace/ui/lib/content-types";

interface CreateLegalDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDoc: (doc: AppLegalDocument) => void;
}

export function CreateLegalDocModal({ isOpen, onClose, onAddDoc }: CreateLegalDocModalProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [version, setVersion] = useState("1.0");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toLocaleDateString("vi-VN"));
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Tiêu đề văn bản không được để trống");
      return;
    }

    const cleanSlug = (slug.trim() || title.trim())
      .toLowerCase()
      .replace(/[^a-z0-9\-_]+/g, "-")
      .replace(/^-|-$/g, "");

    onAddDoc({
      slug: cleanSlug,
      title: title.trim(),
      version: version.trim() || "1.0",
      effectiveDate: effectiveDate.trim() || new Date().toLocaleDateString("vi-VN"),
      content: `# ${title.trim()}\n\nHiệu lực từ ngày: ${effectiveDate.trim()} • Phiên bản ${version.trim()}.\n\n## 1. Điều khoản Chung\nNhập quy định pháp lý tại đây.\n`,
      updatedAt: new Date().toISOString(),
    });

    setTitle("");
    setSlug("");
    setVersion("1.0");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0c121e] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <IconScale className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold font-display text-foreground">
              Thêm Văn Bản Pháp Lý Mới (Legal MDX)
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
              Tiêu đề Văn bản
            </label>
            <input
              type="text"
              placeholder="ví dụ: Cam kết Chất lượng Dịch vụ (SLA)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-primary"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Slug (Đường dẫn)
              </label>
              <input
                type="text"
                placeholder="sla / dpa / cookies"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-primary font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Phiên bản
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ngày Hiệu lực
            </label>
            <input
              type="text"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
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
              Tạo văn bản
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
