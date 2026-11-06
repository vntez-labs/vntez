"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { AppItem } from "@workspace/ui/lib/content-types";
import { AppAvatarUploader } from "./app-avatar-uploader";
import { AppPlatformsSelector } from "./app-platforms-selector";

const PRESET_ILLUSTRATIONS = [
  { key: "storage", label: "Lưu trữ Edge S3" },
  { key: "security", label: "Bảo mật & IAM" },
  { key: "offline", label: "Máy POS Offline" },
  { key: "supply-chain", label: "Chuỗi cung ứng WMS" },
  { key: "telemetry", label: "Giám sát Telemetry" },
  { key: "ecosystem", label: "Bộ công cụ SDK" },
];

interface AppEditModalProps {
  isOpen: boolean;
  initialApp: AppItem | null;
  onClose: () => void;
  onSaved: (app: AppItem) => void;
}

export function AppEditModal({ isOpen, initialApp, onClose, onSaved }: AppEditModalProps) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#fb291a");
  const [ctaLink, setCtaLink] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [illustrationKey, setIllustrationKey] = useState("ecosystem");
  const [platforms, setPlatforms] = useState<string[]>(["Web"]);
  const [status, setStatus] = useState<"active" | "draft">("active");

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialApp) {
      setName(initialApp.name);
      setId(initialApp.id);
      setCategory(initialApp.category);
      setDescription(initialApp.description);
      setColor(initialApp.color || "#fb291a");
      setCtaLink(initialApp.ctaLink || "");
      setReleaseDate(initialApp.releaseDate || "");
      setAvatarUrl(initialApp.avatarUrl || "");
      setIllustrationKey(initialApp.illustrationKey || "ecosystem");
      setPlatforms(initialApp.platforms || ["Web"]);
      setStatus(initialApp.status || "active");
    } else {
      setName("");
      setId("");
      setCategory("Lưu trữ đối tượng");
      setDescription("");
      setColor("#fb291a");
      setCtaLink("/docs");
      setReleaseDate(new Date().toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" }));
      setAvatarUrl("");
      setIllustrationKey("ecosystem");
      setPlatforms(["Web"]);
      setStatus("active");
    }
    setError(null);
  }, [initialApp, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/apps/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tải ảnh thất bại");
      setAvatarUrl(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError("Vui lòng nhập tên và mô tả ứng dụng.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const isEdit = Boolean(initialApp);
      const payload: Partial<AppItem> = {
        id: id.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        color,
        ctaLink: ctaLink.trim() || `/docs#${id}`,
        releaseDate: releaseDate.trim(),
        avatarUrl: avatarUrl.trim() || null,
        illustrationKey,
        platforms,
        status,
      };

      const res = await fetch("/api/apps", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lưu ứng dụng thất bại");

      onSaved(data.app);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0c121e] p-6 shadow-xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-base font-bold text-foreground">
            {initialApp ? "Chỉnh sửa Ứng dụng" : "Thêm Ứng dụng mới"}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-lg">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <AppAvatarUploader
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            color={color}
            isUploading={isUploading}
            onFileUpload={handleFileUpload}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Tên Ứng dụng *</label>
              <input
                type="text"
                required
                placeholder="vntez Storage & Edge"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!initialApp) {
                    setId(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }
                }}
                className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 px-3 py-2 text-xs text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-foreground">ID / Slug *</label>
              <input
                type="text"
                required
                placeholder="storage"
                value={id}
                disabled={Boolean(initialApp)}
                onChange={(e) => setId(e.target.value)}
                className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 px-3 py-2 text-xs text-foreground font-mono ring-1 ring-zinc-200/80 dark:ring-zinc-800 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-foreground">Danh mục / Thể loại</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 px-3 py-2 text-xs text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Màu chủ đạo</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 px-2 py-1.5 text-xs font-mono text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Mô tả sản phẩm *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 p-3 text-xs text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800 resize-none"
            />
          </div>

          <AppPlatformsSelector platforms={platforms} setPlatforms={setPlatforms} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Hình Isometric mặc định (Fallback)</label>
              <select
                value={illustrationKey}
                onChange={(e) => setIllustrationKey(e.target.value)}
                className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 px-3 py-2 text-xs text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800"
              >
                {PRESET_ILLUSTRATIONS.map((p) => (
                  <option key={p.key} value={p.key}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Trạng thái phát hành</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "draft")}
                className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 px-3 py-2 text-xs text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800"
              >
                <option value="active">Hoạt động (Public hiển thị)</option>
                <option value="draft">Bản nháp (Ẩn)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Link chi tiết / Tài liệu</label>
              <input
                type="text"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 px-3 py-2 text-xs text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Ngày phát hành</label>
              <input
                type="text"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 px-3 py-2 text-xs text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSaving}>
              Hủy
            </Button>
            <Button type="submit" size="sm" disabled={isSaving} className="gap-1.5 shadow-xs">
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              <span>{isSaving ? "Đang lưu..." : initialApp ? "Cập nhật Ứng dụng" : "Tạo Ứng dụng"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
