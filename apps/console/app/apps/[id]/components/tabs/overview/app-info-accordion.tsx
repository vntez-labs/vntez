"use client";

import React from "react";
import { IconInfoCircle, IconChevronDown } from "@tabler/icons-react";
import { AutoResizeTextarea } from "@workspace/ui/components/auto-resize-textarea";
import {
  CustomSelect,
  type CustomSelectOption,
} from "@workspace/ui/components/custom-select";
import type { AppItem } from "@workspace/ui/lib/content-types";

interface AppInfoAccordionProps {
  app: AppItem;
  onUpdate: (updates: Partial<AppItem>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const STATUS_OPTIONS: CustomSelectOption[] = [
  {
    value: "active",
    label: "Hoạt động (Active)",
    icon: <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />,
  },
  {
    value: "draft",
    label: "Bản nháp (Draft)",
    icon: <span className="h-2 w-2 rounded-full bg-zinc-400 shrink-0" />,
  },
];

export function AppInfoAccordion({
  app,
  onUpdate,
}: AppInfoAccordionProps) {
  return (
    <div className="p-6 flex flex-col justify-between h-full space-y-6 relative z-20">
      {/* Header */}
      <div className="flex items-center gap-3 pb-5 border-b border-border/60">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
          <IconInfoCircle className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold font-display text-foreground">
            Thông tin Chung & Nhận diện Sản phẩm
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Định danh ứng dụng, màu thương hiệu và mô tả ngắn
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Row 1: App Name, Slug, Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Tên Ứng dụng
              </label>
              <input
                type="text"
                value={app.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-card border border-input text-foreground shadow-2xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                ID Định danh (Slug)
              </label>
              <input
                type="text"
                disabled
                value={app.id}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-muted/50 border border-input text-muted-foreground font-mono shadow-2xs cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Danh mục Phân hệ
              </label>
              <input
                type="text"
                value={app.category || ""}
                onChange={(e) => onUpdate({ category: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-card border border-input text-foreground shadow-2xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
              />
            </div>
          </div>

          {/* Row 2: Description */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Mô tả Sản phẩm (Tự động co giãn theo nội dung)
            </label>
            <div className="p-3 rounded-xl bg-secondary/30 dark:bg-zinc-900/40 border border-border/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
              <AutoResizeTextarea
                minRows={3}
                value={app.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Nhập mô tả sản phẩm chi tiết..."
                className="text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/50 bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Status & Color (Anchored at the bottom) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border/40 relative z-30 mt-auto">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Trạng thái Hoạt động
            </label>
            <CustomSelect
              value={app.status || "active"}
              onChange={(val) =>
                onUpdate({ status: val as "active" | "draft" })
              }
              options={STATUS_OPTIONS}
              variant="outline"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Mã màu Thương hiệu
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={app.color || "#fb291a"}
                onChange={(e) => onUpdate({ color: e.target.value })}
                className="h-10 w-12 rounded-xl cursor-pointer border border-input bg-card p-1 shadow-2xs"
              />
              <input
                type="text"
                value={app.color || "#fb291a"}
                onChange={(e) => onUpdate({ color: e.target.value })}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-card border border-input font-mono text-foreground shadow-2xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
