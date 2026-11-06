"use client";

import React from "react";
import { CustomSelect } from "@workspace/ui/components/custom-select";
import type { AppItem } from "@workspace/ui/lib/content-types";

const ILLUSTRATION_OPTIONS = [
  { value: "storage", label: "Lưu trữ Đối tượng" },
  { value: "iam", label: "Định danh & Phân quyền IAM" },
  { value: "pos", label: "Bán lẻ & POS Offline" },
  { value: "wms", label: "Kho vận & WMS" },
  { value: "telemetry", label: "Giám sát Telemetry" },
  { value: "sdk", label: "Bộ Công cụ SDK" },
  { value: "ecosystem", label: "Hệ sinh thái chung" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động (Hiển thị Public)" },
  { value: "draft", label: "Bản nháp (Ẩn khỏi trang chủ)" },
];

interface AppsEditorFieldsProps {
  id: string;
  setId: (val: string) => void;
  isEdit: boolean;
  category: string;
  setCategory: (val: string) => void;
  color: string;
  setColor: (val: string) => void;
  ctaLink: string;
  setCtaLink: (val: string) => void;
  illustrationKey: AppItem["illustrationKey"];
  setIllustrationKey: (val: AppItem["illustrationKey"]) => void;
  status: "active" | "draft";
  setStatus: (val: "active" | "draft") => void;
}

export function AppsEditorFields({
  id,
  setId,
  isEdit,
  category,
  setCategory,
  color,
  setColor,
  ctaLink,
  setCtaLink,
  illustrationKey,
  setIllustrationKey,
  status,
  setStatus,
}: AppsEditorFieldsProps) {
  return (
    <div className="space-y-8">
      {/* Identifier, Category & Color Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Mã định danh (ID / Slug)
          </label>
          <input
            type="text"
            placeholder="slug-ung-dung"
            value={id}
            disabled={isEdit}
            onChange={(e) => setId(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-zinc-200/80 dark:border-zinc-800 focus:border-primary px-0 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Phân loại danh mục
          </label>
          <input
            type="text"
            placeholder="VD: Lưu trữ đối tượng, POS..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-zinc-200/80 dark:border-zinc-800 focus:border-primary px-0 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Màu sắc nhận diện
          </label>
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-zinc-200/80 dark:border-zinc-800 focus:border-primary px-0 py-1.5 text-xs font-mono text-foreground outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Links, Illustration & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Liên kết Tài liệu
          </label>
          <input
            type="text"
            value={ctaLink}
            placeholder="/docs#ung-dung"
            onChange={(e) => setCtaLink(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-zinc-200/80 dark:border-zinc-800 focus:border-primary px-0 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Hình minh họa Fallback
          </label>
          <CustomSelect
            value={illustrationKey || "ecosystem"}
            onChange={(val) => setIllustrationKey(val as AppItem["illustrationKey"])}
            options={ILLUSTRATION_OPTIONS}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Trạng thái hiển thị
          </label>
          <CustomSelect
            value={status}
            onChange={(val) => setStatus(val as "active" | "draft")}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>
    </div>
  );
}
