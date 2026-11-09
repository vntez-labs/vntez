"use client";

import React, { useState } from "react";
import {
  IconExternalLink,
  IconCopy,
  IconCheck,
  IconEdit,
  IconLayoutColumns,
  IconEye,
} from "@tabler/icons-react";
import { MarkdownCodeEditor } from "@/components/markdown-code-editor";
import { useAppWorkspaceStore } from "../../app-workspace-store";
import { MdxLivePreview } from "../shared/mdx-live-preview";
import { CreateLegalDocModal } from "./create-legal-doc-modal";
import { LegalSidebar } from "./legal/legal-sidebar";
import type { AppLegalDocument } from "@workspace/ui/lib/content-types";

type ViewMode = "split" | "edit" | "preview";

export function LegalTab() {
  const { app, updateApp, copyToClipboard, copiedField } = useAppWorkspaceStore();
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string>("privacy");

  if (!app) return null;

  const fallbackDoc: AppLegalDocument = {
    slug: "privacy",
    title: "Chính sách Bảo mật & Quyền riêng tư",
    version: "1.0",
    effectiveDate: "01/11/2026",
    content:
      app.legal?.privacyPolicyMdx ||
      `# Chính sách Bảo mật — ${app.name}\n\nTuân thủ Nghị định 13/2023/NĐ-CP.\n`,
    updatedAt: new Date().toISOString(),
  };

  const docs: AppLegalDocument[] =
    app.legalDocuments && app.legalDocuments.length > 0
      ? app.legalDocuments
      : [
          fallbackDoc,
          {
            slug: "terms",
            title: "Điều khoản Sử dụng Dịch vụ",
            version: "1.0",
            effectiveDate: "01/11/2026",
            content:
              app.legal?.termsOfServiceMdx ||
              `# Điều khoản Dịch vụ — ${app.name}\n\nQuy tắc sử dụng hệ thống.\n`,
            updatedAt: new Date().toISOString(),
          },
        ];

  const currentDoc = docs.find((d) => d.slug === selectedSlug) || docs[0] || fallbackDoc;

  const handleUpdateCurrentDoc = (updates: Partial<AppLegalDocument>) => {
    const nextDocs = docs.map((d) => {
      if (d.slug === currentDoc.slug) {
        return { ...d, ...updates, updatedAt: new Date().toISOString() };
      }
      return d;
    });
    updateApp({ legalDocuments: nextDocs });
  };

  const handleAddDoc = (newDoc: AppLegalDocument) => {
    const nextDocs = [...docs, newDoc];
    updateApp({ legalDocuments: nextDocs });
    setSelectedSlug(newDoc.slug);
  };

  const handleDeleteDoc = (slug: string) => {
    if (docs.length <= 1) {
      alert("Cần giữ lại ít nhất một văn bản pháp lý");
      return;
    }
    if (!confirm(`Bạn có chắc chắn muốn xóa văn bản [${slug}]?`)) return;

    const nextDocs = docs.filter((d) => d.slug !== slug);
    updateApp({ legalDocuments: nextDocs });
    setSelectedSlug(nextDocs[0]?.slug || "privacy");
  };

  const isRoot = !app.id || app.id === "root";
  const canonicalUrl = isRoot
    ? `https://vntez-legal.vercel.app/${currentDoc.slug}`
    : `https://vntez-legal.vercel.app/${app.id}/${currentDoc.slug}`;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border min-h-[720px] w-full min-w-0">
      {/* 1. Docked Left Sidebar: Documents Tree */}
      <LegalSidebar
        docs={docs}
        currentSlug={currentDoc.slug}
        onSelectDoc={setSelectedSlug}
        onDeleteDoc={handleDeleteDoc}
        onOpenCreateModal={() => setIsModalOpen(true)}
      />

      {/* 2. Main Workbench Area: Header Bar + Editor & Live Preview */}
      <div className="flex-1 flex flex-col min-w-0 bg-card">
        {/* Top Workbench Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <input
              type="text"
              value={currentDoc.title}
              onChange={(e) => handleUpdateCurrentDoc({ title: e.target.value })}
              className="font-bold text-sm sm:text-base text-foreground font-display bg-transparent border-0 focus:outline-none focus:ring-0 w-full"
              placeholder="Tiêu đề văn bản pháp lý..."
            />
            <span className="text-[11px] font-mono text-muted-foreground shrink-0 px-2 py-0.5 rounded-md bg-muted border border-border/60">
              /{currentDoc.slug}
            </span>
            <span className="text-[11px] font-mono text-muted-foreground shrink-0 hidden md:inline">
              v{currentDoc.version || "1.0"}
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
              href={canonicalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-all cursor-pointer shadow-xs"
            >
              <span>Xem trang thật</span>
              <IconExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Canonical Info Sub-bar */}
        <div className="flex items-center justify-between px-5 py-2 bg-muted/20 border-b border-border text-xs font-mono">
          <div className="flex items-center gap-2 truncate text-muted-foreground">
            <span className="text-muted-foreground/60">Canonical:</span>
            <span className="text-foreground font-semibold truncate">{canonicalUrl}</span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(canonicalUrl, "legalCanonical")}
            className="text-[11px] text-primary hover:underline font-sans font-medium inline-flex items-center gap-1 shrink-0 cursor-pointer"
          >
            {copiedField === "legalCanonical" ? (
              <>
                <IconCheck className="h-3 w-3 text-emerald-500" />
                <span>Đã sao chép</span>
              </>
            ) : (
              <>
                <IconCopy className="h-3 w-3" />
                <span>Sao chép URL</span>
              </>
            )}
          </button>
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
                  value={currentDoc.content || ""}
                  onChange={(val) => handleUpdateCurrentDoc({ content: val })}
                  minHeight="640px"
                  borderless={true}
                />
              </div>
            )}

            {(viewMode === "preview" || viewMode === "split") && (
              <div className="min-w-0 h-full flex flex-col overflow-y-auto max-h-[700px]">
                <MdxLivePreview content={currentDoc.content} borderless={true} />
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateLegalDocModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddDoc={handleAddDoc}
      />
    </div>
  );
}
