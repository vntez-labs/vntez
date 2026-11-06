"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Folder, Check, AlertCircle, Loader2 } from "lucide-react";
import { useStorageStore } from "../storage-store";

export function UploadDropzone() {
  const { uploadFile, isUploading, uploadProgress, uploadError } = useStorageStore();
  const [folder, setFolder] = useState("uploads");
  const [isDragOver, setIsDragOver] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file) return;
    setSuccessMsg(null);
    const ok = await uploadFile(file, folder);
    if (ok) {
      setSuccessMsg(`Đã tải lên "${file.name}" thành công!`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-bold text-foreground">
          Tải Tập Tin Lên R2
        </h3>

        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Thư mục:</span>
          <input
            type="text"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            disabled={isUploading}
            placeholder="uploads"
            className="w-28 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl p-7 text-center transition-all ${
          isDragOver
            ? "bg-orange-50/70 dark:bg-orange-950/20 ring-2 ring-orange-500/40"
            : "bg-zinc-50/70 hover:bg-zinc-100/70 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/40"
        } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
          ) : (
            <UploadCloud className="h-5 w-5" />
          )}
        </div>

        <p className="mt-2.5 text-xs font-semibold text-foreground">
          {isUploading ? "Đang đẩy file lên Cloudflare R2..." : "Kéo & thả file vào đây, hoặc click để chọn"}
        </p>

        {isUploading && (
          <div className="mt-3 w-full max-w-xs space-y-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-right text-[10px] font-mono text-muted-foreground">{uploadProgress}%</p>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          <Check className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}
