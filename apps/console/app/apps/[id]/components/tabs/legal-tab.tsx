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
import { AutoResizeTextarea } from "@workspace/ui/components/auto-resize-textarea";
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

  const canonicalUrl = `https://vntez-legal.vercel.app/${app.id}/${currentDoc.slug}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-w-0">
      <LegalSidebar
        docs={docs}
        currentSlug={currentDoc.slug}
        onSelectDoc={setSelectedSlug}
        onDeleteDoc={handleDeleteDoc}
        onOpenCreateModal={() => setIsModalOpen(true)}
      />

      {/* Main Pane: Document Editor & Live Preview */}
      <div className="lg:col-span-3 space-y-4">
        {/* Document Header & Canonical Link */}
        <div className="p-4 rounded-2xl bg-white dark:bg-card border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={currentDoc.title}
                onChange={(e) => handleUpdateCurrentDoc({ title: e.target.value })}
                className="font-bold text-sm sm:text-base text-foreground font-display bg-transparent border-0 focus:outline-none focus:ring-0 w-full"
                placeholder="Tiêu đề văn bản..."
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
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
                href={canonicalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-foreground transition-all cursor-pointer shadow-2xs"
              >
                <span>Xem trang thật</span>
                <IconExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Canonical Info Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 text-xs font-mono">
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
                  <span>Sao chép</span>
                </>
              )}
            </button>
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
                  Bản thảo Văn bản Pháp lý
                </span>
                <span>{currentDoc.content?.length || 0} ký tự</span>
              </div>
              <AutoResizeTextarea
                minRows={16}
                value={currentDoc.content}
                onChange={(e) =>
                  handleUpdateCurrentDoc({ content: e.target.value })
                }
                placeholder="# Tiêu đề chính sách / điều khoản&#10;&#10;Nhập nội dung văn bản pháp lý tại đây..."
                className="text-xs sm:text-sm font-mono leading-relaxed bg-transparent border-0 p-0 text-foreground placeholder:text-muted-foreground/35 outline-none focus:ring-0"
              />
            </div>
          )}

          {(viewMode === "preview" || viewMode === "split") && (
            <MdxLivePreview content={currentDoc.content} />
          )}
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
