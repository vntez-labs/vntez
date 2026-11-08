"use client";

import React, { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  FileArchive,
  Film,
  File,
  Search,
  Download,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { useStorageStore } from "../storage-store";
import { Skeleton } from "@workspace/ui/components/skeleton";
import type { R2FileItem } from "../storage-types";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4 text-emerald-500" />;
  if (type.includes("pdf") || type.includes("text") || type.includes("json"))
    return <FileText className="h-4 w-4 text-sky-500" />;
  if (type.includes("zip") || type.includes("tar") || type.includes("gzip"))
    return <FileArchive className="h-4 w-4 text-amber-500" />;
  if (type.startsWith("video/")) return <Film className="h-4 w-4 text-purple-500" />;
  return <File className="h-4 w-4 text-zinc-400" />;
}

export function FilesTable() {
  const {
    files,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    deleteFile,
    getDownloadUrl,
    generatedSignedUrl,
    generatingKey,
    clearGeneratedUrl,
  } = useStorageStore();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.key.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === "image") return f.content_type.startsWith("image/");
    if (filterType === "document")
      return (
        f.content_type.includes("json") ||
        f.content_type.includes("pdf") ||
        f.content_type.includes("text")
      );
    if (filterType === "archive")
      return (
        f.content_type.includes("zip") ||
        f.content_type.includes("tar") ||
        f.content_type.includes("gzip")
      );
    return true;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="rounded-2xl bg-card shadow-xs overflow-hidden border border-border">
      {/* Header & Controls */}
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-foreground">
            Tập Tin Lưu Trữ
          </h3>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-mono font-medium text-muted-foreground">
            {filteredFiles.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm theo file key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-44 rounded-lg bg-card border border-input shadow-2xs py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex rounded-lg bg-muted/60 border border-border/60 p-0.5 text-xs">
            {(["all", "image", "document", "archive"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`rounded-md px-2.5 py-1 capitalize transition-colors ${
                  filterType === t
                    ? "bg-card font-semibold text-foreground shadow-xs border border-border/80"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "all" ? "Tất cả" : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Signed URL alert banner */}
      {generatedSignedUrl && (
        <div className="flex items-center justify-between gap-3 bg-orange-50/80 p-3 text-xs text-orange-950 dark:bg-orange-950/30 dark:text-orange-200">
          <div className="flex items-center gap-2 truncate">
            <LinkIcon className="h-4 w-4 shrink-0 text-orange-600 dark:text-orange-400" />
            <span className="font-semibold shrink-0">Presigned GET:</span>
            <span className="truncate font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
              {generatedSignedUrl}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopy(generatedSignedUrl, "signed_banner")}
              className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-xs font-medium text-orange-700 shadow-xs hover:bg-orange-100 dark:bg-zinc-800 dark:text-orange-300"
            >
              {copiedKey === "signed_banner" ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" /> Đã chép
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Chép
                </>
              )}
            </button>
            <button
              onClick={clearGeneratedUrl}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/60 text-muted-foreground uppercase font-mono tracking-wider border-b border-border">
            <tr>
              <th className="px-5 py-3 font-medium">Tên file / Key</th>
              <th className="px-4 py-3 font-medium">Định dạng</th>
              <th className="px-4 py-3 font-medium">Kích thước</th>
              <th className="px-4 py-3 font-medium">Thời gian</th>
              <th className="px-5 py-3 text-right font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100/80 dark:divide-zinc-800/40">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="h-6 w-6 rounded-md shrink-0" />
                      <Skeleton className="h-4 w-40 rounded" />
                    </div>
                  </td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20 rounded" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-16 rounded" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-28 rounded" /></td>
                  <td className="px-5 py-3 text-right"><Skeleton className="h-7 w-20 rounded-lg ml-auto" /></td>
                </tr>
              ))
            ) : filteredFiles.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  Không tìm thấy tập tin nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredFiles.map((f: R2FileItem) => (
                <tr
                  key={f.key}
                  className="group transition-colors hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30"
                >
                  <td className="px-5 py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2.5">
                      <div className="shrink-0">{getFileIcon(f.content_type)}</div>
                      <span className="font-mono text-xs">{f.key}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {f.content_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">
                    {formatBytes(f.size)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono">
                    {new Date(f.uploaded_at).toLocaleDateString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="Tạo Presigned Download URL"
                        onClick={() => getDownloadUrl(f.key)}
                        disabled={generatingKey === f.key}
                        className="inline-flex items-center gap-1 rounded-lg bg-zinc-100/70 hover:bg-zinc-200/70 dark:bg-zinc-800/60 px-2 py-1 text-[11px] font-medium text-foreground transition-colors"
                      >
                        {generatingKey === f.key ? (
                          <Loader2 className="h-3 w-3 animate-spin text-orange-500" />
                        ) : (
                          <Download className="h-3 w-3" />
                        )}
                        <span>Ký URL</span>
                      </button>

                      {f.download_url && (
                        <a
                          href={f.download_url}
                          target="_blank"
                          rel="noreferrer"
                          title="Mở URL"
                          className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}

                      <button
                        onClick={() => deleteFile(f.key)}
                        title="Xóa file"
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
