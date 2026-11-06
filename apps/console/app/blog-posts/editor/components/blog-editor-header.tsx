"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface BlogEditorHeaderProps {
  isSaving: boolean;
  onSave: () => void;
}

export function BlogEditorHeader({
  isSaving,
  onSave,
}: BlogEditorHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Link
        href="/blog-posts"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground py-2 px-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Danh sách bài viết</span>
      </Link>

      <div className="flex items-center gap-2.5">
        <Link href="/blog-posts">
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
          className="h-9 gap-1.5 text-xs shadow-xs px-5 cursor-pointer font-semibold"
        >
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          <span>Xuất bản bài</span>
        </Button>
      </div>
    </div>
  );
}
