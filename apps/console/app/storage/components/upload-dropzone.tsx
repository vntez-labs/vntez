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
    <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/60">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Tải File Trực Tiếp lên R2 Bucket
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Sử dụng Presigned S3 PUT URL trực tiếp tới Cloudflare R2 Storage (tự động phân mảnh cho file lớn)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-zinc-400" />
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Thư mục:</span>
          <input
            type="text"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            disabled={isUploading}
            placeholder="uploads"
            className="w-28 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-800 shadow-sm focus:border-orange-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
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
        className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          isDragOver
            ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/20"
            : "border-zinc-300 bg-zinc-50/50 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950/30 dark:hover:border-zinc-600"
        } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          ) : (
            <UploadCloud className="h-6 w-6" />
          )}
        </div>

        <p className="mt-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {isUploading ? "Đang đẩy file lên Cloudflare R2..." : "Kéo & thả file vào đây, hoặc click để chọn"}
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Hỗ trợ mọi định dạng: hình ảnh, video, audio, archive, tài liệu PDF, JSON
        </p>

        {isUploading && (
          <div className="mt-4 w-full max-w-xs space-y-1.5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-right text-[10px] text-zinc-500">{uploadProgress}%</p>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          <Check className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}
