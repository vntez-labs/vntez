"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Edit3, Eye, Columns } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface AppsEditorHeaderProps {
  isEditing: boolean;
  isSaving: boolean;
  activeTab: "form" | "preview" | "split";
  setActiveTab: (tab: "form" | "preview" | "split") => void;
  onSave: () => void;
}

export function AppsEditorHeader({
  isEditing,
  isSaving,
  activeTab,
  setActiveTab,
  onSave,
}: AppsEditorHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
      <div className="flex items-center gap-3">
        <Link
          href="/apps"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại danh sách</span>
        </Link>
        <span className="text-zinc-300 dark:text-zinc-700">|</span>
        <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
          {isEditing ? "Chỉnh sửa Ứng dụng" : "Khởi tạo Ứng dụng mới"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* View Mode Switcher */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/70 p-1 rounded-xl gap-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
              activeTab === "form"
                ? "bg-white dark:bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit3 className="h-3 w-3" />
            <span>Biểu mẫu</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
              activeTab === "preview"
                ? "bg-white dark:bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-3 w-3" />
            <span>Xem trước</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("split")}
            className={`hidden md:flex px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all items-center gap-1 ${
              activeTab === "split"
                ? "bg-white dark:bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Columns className="h-3 w-3" />
            <span>Song song</span>
          </button>
        </div>

        <Link href="/apps">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs h-9 cursor-pointer"
          >
            Hủy
          </Button>
        </Link>
        <Button
          type="button"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="h-9 gap-1.5 text-xs shadow-xs px-5 cursor-pointer"
        >
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          <span>{isEditing ? "Lưu thay đổi" : "Tạo & Xuất bản"}</span>
        </Button>
      </div>
    </div>
  );
}
