"use client";

import React from "react";
import Link from "next/link";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconMaximize,
  IconMinimize,
  IconLayoutSidebar,
  IconLayoutSidebarFilled,
  IconColumns,
  IconEdit,
  IconEye,
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";

export type EditorViewMode = "split" | "editor" | "preview";

interface BlogEditorHeaderProps {
  isSaving: boolean;
  onSave: () => void;
  viewMode: EditorViewMode;
  setViewMode: (mode: EditorViewMode) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  showMeta: boolean;
  onToggleMeta: () => void;
}

export function BlogEditorHeader({
  isSaving,
  onSave,
  viewMode,
  setViewMode,
  isFullscreen,
  onToggleFullscreen,
  showMeta,
  onToggleMeta,
}: BlogEditorHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
      {/* Left Navigation */}
      <div className="flex items-center gap-2">
        {!isFullscreen && (
          <Link
            href="/blog-posts"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground py-1.5 px-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <IconArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Quản lý Blog</span>
          </Link>
        )}

        {/* Toggle Metadata Sidebar / Section */}
        <button
          type="button"
          onClick={onToggleMeta}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer border ${
            showMeta
              ? "bg-zinc-100 dark:bg-zinc-800 text-foreground border-zinc-200 dark:border-zinc-700"
              : "bg-transparent text-muted-foreground border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
          title={showMeta ? "Thu gọn thông tin bài viết" : "Mở rộng thông tin bài viết"}
        >
          {showMeta ? <IconLayoutSidebarFilled className="h-3.5 w-3.5 text-primary" /> : <IconLayoutSidebar className="h-3.5 w-3.5" />}
          <span className="text-[11px]">{showMeta ? "Ẩn thông tin" : "Hiện thông tin"}</span>
        </button>
      </div>

      {/* Center: View Mode Segmented Controls */}
      <div className="inline-flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-xs">
        <button
          type="button"
          onClick={() => setViewMode("editor")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
            viewMode === "editor"
              ? "bg-white dark:bg-zinc-900 text-foreground font-semibold shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title="Chế độ chỉ soạn thảo (Full Width)"
        >
          <IconEdit className="h-3.5 w-3.5" />
          <span className="hidden md:inline text-[11px]">Soạn thảo</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode("split")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
            viewMode === "split"
              ? "bg-white dark:bg-zinc-900 text-foreground font-semibold shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title="Chế độ chia đôi màn hình (Side-by-side)"
        >
          <IconColumns className="h-3.5 w-3.5" />
          <span className="hidden md:inline text-[11px]">Chia đôi</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode("preview")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
            viewMode === "preview"
              ? "bg-white dark:bg-zinc-900 text-foreground font-semibold shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title="Chế độ chỉ xem trước (Full Width)"
        >
          <IconEye className="h-3.5 w-3.5" />
          <span className="hidden md:inline text-[11px]">Xem trước</span>
        </button>
      </div>

      {/* Right Actions: Fullscreen & Save */}
      <div className="flex items-center gap-2">
        {/* Fullscreen Zen Mode Button */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
            isFullscreen
              ? "bg-primary/10 text-primary border-primary/30"
              : "bg-white dark:bg-zinc-800 text-foreground border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
          }`}
          title={isFullscreen ? "Thu nhỏ về giao diện thường" : "Mở rộng toàn màn hình (Zen Mode)"}
        >
          {isFullscreen ? <IconMinimize className="h-4 w-4" /> : <IconMaximize className="h-4 w-4" />}
          <span className="text-[11px] font-medium hidden sm:inline">
            {isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
          </span>
        </button>

        <Button
          type="button"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="h-8 gap-1.5 text-xs shadow-xs px-4 cursor-pointer font-semibold"
        >
          <IconDeviceFloppy className="h-3.5 w-3.5" />
          <span>{isSaving ? "Đang lưu..." : "Lưu bài viết"}</span>
        </Button>
      </div>
    </div>
  );
}
