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
    <div className="rounded-2xl border border-zinc-200/80 bg-white/70 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/60">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 border-b border-zinc-200/60 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800/60">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Tập Tin Lưu Trữ ({filteredFiles.length})
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Quản lý object trong bucket, tạo presigned download link bảo mật
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo file key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-xs text-zinc-800 placeholder-zinc-400 shadow-sm focus:border-orange-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex rounded-lg border border-zinc-200 bg-zinc-100/70 p-0.5 text-xs dark:border-zinc-800 dark:bg-zinc-800/60">
            {(["all", "image", "document", "archive"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`rounded-md px-2.5 py-1 capitalize transition-colors ${
                  filterType === t
                    ? "bg-white font-semibold text-zinc-900 shadow-xs dark:bg-zinc-700 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
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
        <div className="flex items-center justify-between gap-3 border-b border-orange-200/80 bg-orange-50/80 p-3.5 text-xs text-orange-950 dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-200">
          <div className="flex items-center gap-2 truncate">
            <LinkIcon className="h-4 w-4 shrink-0 text-orange-600 dark:text-orange-400" />
            <span className="font-semibold shrink-0">Presigned GET URL:</span>
            <span className="truncate font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
              {generatedSignedUrl}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopy(generatedSignedUrl, "signed_banner")}
              className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-orange-700 shadow-sm hover:bg-orange-100 dark:bg-zinc-800 dark:text-orange-300"
            >
              {copiedKey === "signed_banner" ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" /> Đã chép
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Chép URL
                </>
              )}
            </button>
            <button
              onClick={clearGeneratedUrl}
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50/70 text-zinc-500 dark:bg-zinc-950/30 dark:text-zinc-400">
            <tr>
              <th className="px-5 py-3 font-medium">Tên file / Key</th>
              <th className="px-4 py-3 font-medium">Định dạng</th>
              <th className="px-4 py-3 font-medium">Kích thước</th>
              <th className="px-4 py-3 font-medium">Thời gian tạo</th>
              <th className="px-5 py-3 text-right font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
            {filteredFiles.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  Không tìm thấy tập tin nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredFiles.map((f: R2FileItem) => (
                <tr
                  key={f.key}
                  className="group transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                >
                  <td className="px-5 py-3.5 font-medium text-zinc-900 dark:text-zinc-100">
                    <div className="flex items-center gap-2.5">
                      <div className="shrink-0">{getFileIcon(f.content_type)}</div>
                      <span className="font-mono text-xs">{f.key}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-500 dark:text-zinc-400">
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {f.content_type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-zinc-600 dark:text-zinc-300">
                    {formatBytes(f.size)}
                  </td>
                  <td className="px-4 py-3.5 text-zinc-500 dark:text-zinc-400">
                    {new Date(f.uploaded_at).toLocaleDateString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Generate Signed Download URL button */}
                      <button
                        title="Tạo Presigned Download URL (3600s)"
                        onClick={() => getDownloadUrl(f.key)}
                        disabled={generatingKey === f.key}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                      >
                        {generatingKey === f.key ? (
                          <Loader2 className="h-3 w-3 animate-spin text-orange-500" />
                        ) : (
                          <Download className="h-3 w-3" />
                        )}
                        <span>Ký URL</span>
                      </button>

                      {/* Direct public link if available */}
                      {f.download_url && (
                        <a
                          href={f.download_url}
                          target="_blank"
                          rel="noreferrer"
                          title="Mở URL công khai"
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => deleteFile(f.key)}
                        title="Xóa file khỏi bucket"
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
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
