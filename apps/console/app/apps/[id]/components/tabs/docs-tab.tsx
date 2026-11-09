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
import { MarkdownCodeEditor } from "@/components/markdown-code-editor";
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

  const isRoot = !app.id || app.id === "root";
  const publicDocUrl = isRoot
    ? "https://vntez-docs.vercel.app"
    : `https://vntez-docs.vercel.app/docs/${app.id}${
        currentPage.slug === "index" ? "" : `/${currentPage.slug}`
      }`;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border min-h-[720px] w-full min-w-0">
      {/* 1. Docked Left Sidebar: Pages Tree (Compact width to maximize editor workspace) */}
      <div className="w-full lg:w-48 xl:w-56 shrink-0 bg-muted/20 flex flex-col divide-y divide-border">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/40">
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

        {/* Pages Navigation List */}
        <div className="flex-1 p-2 space-y-1 overflow-y-auto max-h-[600px]">
          {pages.map((p) => {
            const isSelected = p.slug === currentPage.slug;
            return (
              <div
                key={p.slug}
                onClick={() => setSelectedSlug(p.slug)}
                className={`group flex items-center justify-between p-2.5 rounded-xl text-left cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-primary text-white font-semibold shadow-xs"
                    : "hover:bg-muted/70 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className={`text-xs truncate ${isSelected ? "text-white font-bold" : "text-foreground"}`}>
                    {p.title}
                  </div>
                  <div className={`text-[10px] font-mono truncate ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
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
                    className={`opacity-0 group-hover:opacity-100 p-1 rounded-md cursor-pointer transition-opacity ${
                      isSelected
                        ? "text-white/90 hover:bg-white/20"
                        : "text-rose-500 hover:bg-rose-500/10"
                    }`}
                    title="Xóa trang"
                  >
                    <IconTrash className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Bottom Action */}
        <div className="p-3 bg-muted/30">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="w-full text-xs rounded-xl cursor-pointer gap-1.5 bg-card border-border shadow-2xs hover:bg-muted font-medium"
          >
            <IconPlus className="h-3.5 w-3.5" />
            <span>Thêm trang tài liệu</span>
          </Button>
        </div>
      </div>

      {/* 2. Main Workbench Area: Header Bar + Editor & Live Preview */}
      <div className="flex-1 flex flex-col min-w-0 bg-card">
        {/* Top Workbench Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <input
              type="text"
              value={currentPage.title}
              onChange={(e) => handleUpdateCurrentPage({ title: e.target.value })}
              className="font-bold text-sm sm:text-base text-foreground font-display bg-transparent border-0 focus:outline-none focus:ring-0 w-full"
              placeholder="Tiêu đề trang tài liệu..."
            />
            <span className="text-[11px] font-mono text-muted-foreground shrink-0 px-2 py-0.5 rounded-md bg-muted border border-border/60">
              /{currentPage.slug}
            </span>
            <span className="text-[11px] font-sans text-muted-foreground shrink-0 hidden md:inline">
              • {currentPage.category || "Tài liệu"}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle: Edit / Split / Preview */}
            <div className="flex items-center rounded-xl bg-muted/70 p-0.5 text-xs border border-border/60">
              <button
                type="button"
                onClick={() => setViewMode("edit")}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                  viewMode === "edit" ? "bg-card text-foreground shadow-2xs font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Chỉ mở trình soạn thảo"
              >
                <IconEdit className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                  viewMode === "split" ? "bg-card text-foreground shadow-2xs font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Chia đôi màn hình (Editor + Preview)"
              >
                <IconLayoutColumns className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                  viewMode === "preview" ? "bg-card text-foreground shadow-2xs font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Xem trước kết quả rendered"
              >
                <IconEye className="h-3.5 w-3.5" />
              </button>
            </div>

            <a
              href={publicDocUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:opacity-90 transition-all cursor-pointer shadow-xs"
            >
              <span>Xem Docs</span>
              <IconExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Unified Canvas: Split Editor & Preview */}
        <div className="flex-1 grid min-w-0 h-full">
          <div
            className={`grid min-w-0 h-full ${
              viewMode === "split"
                ? "grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-border"
                : "grid-cols-1"
            }`}
          >
            {(viewMode === "edit" || viewMode === "split") && (
              <div className="min-w-0 h-full flex flex-col">
                <MarkdownCodeEditor
                  value={currentPage.content || ""}
                  onChange={(val) => handleUpdateCurrentPage({ content: val })}
                  minHeight="640px"
                  borderless={true}
                />
              </div>
            )}

            {(viewMode === "preview" || viewMode === "split") && (
              <div className="min-w-0 h-full flex flex-col overflow-y-auto max-h-[700px]">
                <MdxLivePreview content={currentPage.content} borderless={true} />
              </div>
            )}
          </div>
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
