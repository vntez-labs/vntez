"use client";

import React, { useState } from "react";
import {
  IconFileCode,
  IconEye,
  IconEdit,
  IconLayoutColumns,
  IconExternalLink,
  IconPlus,
  IconTrash,
  IconFileText,
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { AutoResizeTextarea } from "@workspace/ui/components/auto-resize-textarea";
import { useAppWorkspaceStore } from "../../app-workspace-store";
import { MdxLivePreview } from "../shared/mdx-live-preview";
import { CreateDocPageModal } from "./create-doc-page-modal";
import type { AppDocPage } from "@workspace/ui/lib/content-types";

type ViewMode = "split" | "edit" | "preview";

export function DocsTab() {
  const { app, updateApp } = useAppWorkspaceStore();
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string>("index");

  if (!app) return null;

  const fallbackPage: AppDocPage = {
    slug: "index",
    title: "Tổng quan & Kiến trúc",
    category: "Bắt đầu",
    content: app.docsMdx || `# Tài liệu: ${app.name}\n\nNhập nội dung MDX...`,
    updatedAt: new Date().toISOString(),
  };

  const pages: AppDocPage[] =
    app.docsPages && app.docsPages.length > 0 ? app.docsPages : [fallbackPage];

  const currentPage = pages.find((p) => p.slug === selectedSlug) || pages[0] || fallbackPage;

  const handleUpdateCurrentPage = (updates: Partial<AppDocPage>) => {
    const nextPages = pages.map((p) => {
      if (p.slug === currentPage.slug) {
        return { ...p, ...updates, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    updateApp({ docsPages: nextPages });
  };

  const handleAddPage = (newPage: AppDocPage) => {
    const nextPages = [...pages, newPage];
    updateApp({ docsPages: nextPages });
    setSelectedSlug(newPage.slug);
  };

  const handleDeletePage = (slug: string) => {
    if (pages.length <= 1) {
      alert("Cần giữ lại ít nhất một trang tài liệu");
      return;
    }
    if (!confirm(`Bạn có chắc chắn muốn xóa trang tài liệu [${slug}]?`)) return;

    const nextPages = pages.filter((p) => p.slug !== slug);
    updateApp({ docsPages: nextPages });
    setSelectedSlug(nextPages[0]?.slug || "index");
  };

  const publicDocUrl = `https://vntez-docs.vercel.app/docs/${app.id}${
    currentPage.slug === "index" ? "" : `/${currentPage.slug}`
  }`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-w-0">
      {/* 1. Left Sidebar: Pages List */}
      <div className="lg:col-span-1 space-y-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-card border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconFileText className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-foreground">
                Danh Sách Trang ({pages.length})
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors cursor-pointer"
              title="Thêm trang mới"
            >
              <IconPlus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1">
            {pages.map((p) => {
              const isSelected = p.slug === currentPage.slug;
              return (
                <div
                  key={p.slug}
                  onClick={() => setSelectedSlug(p.slug)}
                  className={`group flex items-center justify-between p-2.5 rounded-xl text-left cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="text-xs truncate">{p.title}</div>
                    <div className="text-[10px] font-mono text-muted-foreground truncate">
                      /{p.slug}
                    </div>
                  </div>

                  {pages.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePage(p.slug);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-opacity"
                      title="Xóa trang"
                    >
                      <IconTrash className="h-3 w-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="w-full text-xs rounded-xl cursor-pointer gap-1.5"
          >
            <IconPlus className="h-3.5 w-3.5" />
            <span>Thêm trang tài liệu</span>
          </Button>
        </div>
      </div>

      {/* 2. Main Pane: Page Editor & Preview */}
      <div className="lg:col-span-3 space-y-4">
        {/* Page metadata bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-card border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={currentPage.title}
                onChange={(e) => handleUpdateCurrentPage({ title: e.target.value })}
                className="font-bold text-sm sm:text-base text-foreground font-display bg-transparent border-0 focus:outline-none focus:ring-0 w-full"
                placeholder="Tiêu đề trang..."
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* View mode toggle */}
              <div className="flex items-center rounded-xl bg-zinc-100 dark:bg-zinc-800/80 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("edit")}
                  className={`p-1.5 rounded-lg cursor-pointer ${
                    viewMode === "edit" ? "bg-white dark:bg-card text-foreground shadow-2xs" : "text-muted-foreground"
                  }`}
                  title="Chỉ soạn thảo"
                >
                  <IconEdit className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("split")}
                  className={`p-1.5 rounded-lg cursor-pointer ${
                    viewMode === "split" ? "bg-white dark:bg-card text-foreground shadow-2xs" : "text-muted-foreground"
                  }`}
                  title="Chia đôi màn hình"
                >
                  <IconLayoutColumns className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("preview")}
                  className={`p-1.5 rounded-lg cursor-pointer ${
                    viewMode === "preview" ? "bg-white dark:bg-card text-foreground shadow-2xs" : "text-muted-foreground"
                  }`}
                  title="Xem trước"
                >
                  <IconEye className="h-3.5 w-3.5" />
                </button>
              </div>

              <a
                href={publicDocUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-primary text-white hover:opacity-90 transition-all cursor-pointer shadow-xs"
              >
                <span>Xem Docs</span>
                <IconExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
            <span>Slug:</span>
            <span className="text-foreground">/{currentPage.slug}</span>
            <span className="text-muted-foreground/30">•</span>
            <span>Phân nhóm:</span>
            <span className="text-foreground">{currentPage.category || "Chung"}</span>
          </div>
        </div>

        {/* Content Pane */}
        <div
          className={`grid gap-4 ${
            viewMode === "split"
              ? "grid-cols-1 lg:grid-cols-2"
              : viewMode === "edit"
                ? "grid-cols-1"
                : "grid-cols-1"
          }`}
        >
          {(viewMode === "edit" || viewMode === "split") && (
            <div className="p-5 rounded-2xl bg-white dark:bg-card border border-border/80 shadow-xs space-y-3 focus-within:border-primary/50 transition-all">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono pb-2 border-b border-border/40">
                <span className="text-foreground/70 font-sans font-medium">
                  Bản thảo Markdown / MDX
                </span>
                <span>{currentPage.content?.length || 0} ký tự</span>
              </div>
              <AutoResizeTextarea
                minRows={16}
                value={currentPage.content}
                onChange={(e) =>
                  handleUpdateCurrentPage({ content: e.target.value })
                }
                placeholder="# Tiêu đề tài liệu&#10;&#10;Bắt đầu soạn thảo nội dung Markdown / MDX tại đây..."
                className="text-xs sm:text-sm font-mono leading-relaxed bg-transparent border-0 p-0 text-foreground placeholder:text-muted-foreground/35 outline-none focus:ring-0"
              />
            </div>
          )}

          {(viewMode === "preview" || viewMode === "split") && (
            <MdxLivePreview content={currentPage.content} />
          )}
        </div>
      </div>

      <CreateDocPageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPage={handleAddPage}
      />
    </div>
  );
}
