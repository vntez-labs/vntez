"use client";

import React from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";

interface PaperAvatarUploaderProps {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  color: string;
  isUploading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PaperAvatarUploader({
  avatarUrl,
  setAvatarUrl,
  color,
  isUploading,
  onFileUpload,
}: PaperAvatarUploaderProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
        Logo / Avatar Ứng dụng
      </label>

      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Avatar Display */}
        <div className="relative shrink-0">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="Avatar"
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-zinc-200 dark:ring-zinc-800 shadow-sm"
            />
          ) : (
            <div
              className="flex h-20 w-20 items-center justify-center rounded-2xl text-white font-bold shadow-sm transition-transform"
              style={{ backgroundColor: color || "#fb291a" }}
            >
              <ImageIcon className="h-9 w-9 opacity-80" />
            </div>
          )}

          {avatarUrl && (
            <button
              type="button"
              onClick={() => setAvatarUrl("")}
              title="Xóa ảnh"
              className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-500 text-white shadow-xs hover:bg-rose-600 cursor-pointer transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Action & Direct URL */}
        <div className="flex-1 space-y-3 min-w-0">
          <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 text-xs font-medium text-foreground transition-colors">
            <Upload className="h-3.5 w-3.5 text-primary" />
            <span>{isUploading ? "Đang tải ảnh lên..." : "Tải ảnh từ thiết bị"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={onFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>

          <div className="space-y-1">
            <input
              type="text"
              placeholder="Hoặc dán trực tiếp liên kết URL hình ảnh..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-zinc-200/80 dark:border-zinc-800 focus:border-primary px-0 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
