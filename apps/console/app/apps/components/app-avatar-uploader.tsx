"use client";

import React from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

interface AppAvatarUploaderProps {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  color: string;
  isUploading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AppAvatarUploader({
  avatarUrl,
  setAvatarUrl,
  color,
  isUploading,
  onFileUpload,
}: AppAvatarUploaderProps) {
  return (
    <div className="flex items-center gap-4 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40">
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt="Avatar"
          className="h-16 w-16 rounded-xl object-cover ring-2 ring-primary/20 shrink-0"
        />
      ) : (
        <div
          className="flex h-16 w-16 items-center justify-center rounded-xl text-white font-bold shrink-0 shadow-xs"
          style={{ backgroundColor: color }}
        >
          <ImageIcon className="h-7 w-7 opacity-80" />
        </div>
      )}

      <div className="flex-1 space-y-1.5 min-w-0">
        <label className="font-semibold text-foreground block">
          Avatar / Logo Ứng dụng
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-white dark:bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-2xs hover:bg-zinc-50 dark:hover:bg-zinc-800">
            <Upload className="h-3.5 w-3.5 text-primary" />
            <span>{isUploading ? "Đang tải lên..." : "Tải ảnh từ máy"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={onFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
          {avatarUrl && (
            <button
              type="button"
              onClick={() => setAvatarUrl("")}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              Xóa ảnh
            </button>
          )}
        </div>
        <input
          type="text"
          placeholder="Hoặc nhập trực tiếp URL hình ảnh..."
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full rounded-lg bg-white dark:bg-card px-2.5 py-1 text-xs text-foreground ring-1 ring-zinc-200 dark:ring-zinc-800"
        />
      </div>
    </div>
  );
}
