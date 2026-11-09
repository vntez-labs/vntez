"use client";

import React from "react";
import type { EditorViewMode } from "./blog-editor-header";
import { MarkdownToolbar } from "../../components/markdown-toolbar";
import { MarkdownPreview } from "../../components/markdown-preview";
import { MarkdownCodeEditor } from "@/components/markdown-code-editor";

interface BlogWorkspacePanesProps {
  viewMode: EditorViewMode;
  isFullscreen: boolean;
  content: string;
  onChangeContent: (val: string) => void;
  editorRef: React.MutableRefObject<any>;
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
  editorRef,
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
      <div className={`w-full ${containerHeightClass} rounded-2xl border border-border bg-card overflow-hidden shadow-xs flex`}>
        {/* Editor Pane (Monaco VS Code Engine) */}
        {(viewMode === "editor" || viewMode === "split") && (
          <div
            className={`h-full flex flex-col overflow-hidden ${
              viewMode === "split" ? "w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-border" : "w-full"
            }`}
          >
            <MarkdownCodeEditor
              value={content}
              onChange={onChangeContent}
              borderless={true}
              minHeight="100%"
              className="h-full"
              editorRef={editorRef}
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
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold pb-2 mb-4 border-b border-border flex items-center justify-between">
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
