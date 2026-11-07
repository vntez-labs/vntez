"use client";

import React from "react";
import type { EditorViewMode } from "./blog-editor-header";
import { MarkdownToolbar } from "../../components/markdown-toolbar";
import { MarkdownPreview } from "../../components/markdown-preview";

interface BlogWorkspacePanesProps {
  viewMode: EditorViewMode;
  isFullscreen: boolean;
  content: string;
  onChangeContent: (val: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onInsert: (prefix: string, suffix?: string) => void;
  meta: {
    title: string;
    category: string;
    author: string;
    readTime: string;
    thumbnailUrl: string;
  };
}

export function BlogWorkspacePanes({
  viewMode,
  isFullscreen,
  content,
  onChangeContent,
  textareaRef,
  onInsert,
  meta,
}: BlogWorkspacePanesProps) {
  const containerHeightClass = isFullscreen
    ? "h-[calc(100vh-140px)]"
    : "min-h-[550px] h-[calc(100vh-320px)]";

  return (
    <div className="space-y-3 flex-1 min-h-0 flex flex-col">
      {/* Markdown Quick Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
          Nội dung Markdown ({content.length} ký tự • {content.split("\n").length} dòng)
        </label>
        <MarkdownToolbar onInsert={onInsert} />
      </div>

      {/* Main Multi-Mode Panes */}
      <div className={`w-full ${containerHeightClass} rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#0c121e] overflow-hidden shadow-xs flex`}>
        {/* Editor Pane */}
        {(viewMode === "editor" || viewMode === "split") && (
          <div
            className={`h-full flex flex-col p-4 sm:p-6 overflow-hidden ${
              viewMode === "split" ? "w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-zinc-200/80 dark:border-zinc-800" : "w-full"
            }`}
          >
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
              <span>Trình soạn thảo Markdown</span>
              <span className="text-[10px] text-zinc-400">Hỗ trợ phím tắt, code blocks, bảng biểu</span>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => onChangeContent(e.target.value)}
              placeholder="# Bắt đầu soạn thảo bài viết bằng Markdown...&#10;&#10;## 1. Giới thiệu&#10;&#10;```ts&#10;const fast = true;&#10;```"
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              data-gramm="false"
              data-enable-grammarly="false"
              className="flex-1 w-full resize-none font-mono text-sm leading-relaxed bg-transparent border-0 outline-none text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 overflow-y-auto focus:ring-0 p-1"
            />
          </div>
        )}

        {/* Live Preview Pane */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={`h-full overflow-y-auto p-4 sm:p-6 lg:p-8 ${
              viewMode === "split" ? "w-full lg:w-1/2" : "w-full"
            } bg-zinc-50/40 dark:bg-[#0B0F19]/40`}
          >
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold pb-2 mb-4 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
              <span>Xem trước thời gian thực (Live Preview)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● Đồng bộ tức thời</span>
            </div>
            <MarkdownPreview
              title={meta.title}
              category={meta.category}
              author={meta.author}
              readTime={meta.readTime}
              thumbnailUrl={meta.thumbnailUrl}
              content={content}
            />
          </div>
        )}
      </div>
    </div>
  );
}
