"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { AutoResizeTextarea } from "@workspace/ui/components/auto-resize-textarea";
import type { AppItem } from "@workspace/ui/lib/content-types";
import { AppsEditorHeader } from "./components/apps-editor-header";
import { AppsEditorFields } from "./components/apps-editor-fields";
import { PaperAvatarUploader } from "./components/paper-avatar-uploader";
import { PaperPlatformsSelector } from "./components/paper-platforms-selector";
import { ProductCardPreview } from "./components/product-card-preview";

export default function AppsEditorPage() {
  return (
    <AuthGuard>
      <ConsoleShell>
        <Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Đang tải biểu mẫu...</div>}>
          <AppsEditorContent />
        </Suspense>
      </ConsoleShell>
    </AuthGuard>
  );
}

function AppsEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(Boolean(editId));
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [category, setCategory] = useState("Dịch vụ Đám mây");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#fb291a");
  const [platforms, setPlatforms] = useState<string[]>(["Web"]);
  const [ctaLink, setCtaLink] = useState("/docs");
  const [status, setStatus] = useState<"active" | "draft">("active");
  const [illustrationKey, setIllustrationKey] = useState<AppItem["illustrationKey"]>("storage");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (!editId) return;
    async function loadTargetApp() {
      try {
        const res = await fetch("/api/apps");
        const data = await res.json();
        if (data.success && Array.isArray(data.apps)) {
          const found = data.apps.find((a: AppItem) => a.id === editId);
          if (found) {
            setName(found.name);
            setId(found.id);
            setCategory(found.category || "Dịch vụ Đám mây");
            setDescription(found.description || "");
            setColor(found.color || "#fb291a");
            setPlatforms(found.platforms || ["Web"]);
            setCtaLink(found.ctaLink || "/docs");
            setStatus(found.status || "active");
            setIllustrationKey(found.illustrationKey || "storage");
            setAvatarUrl(found.avatarUrl || "");
          }
        }
      } catch (err) {
        console.error("Failed to load app:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTargetApp();
  }, [editId]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editId) {
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setId(slug);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setErrorMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/apps/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload thất bại");
      setAvatarUrl(data.url);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Upload thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !description.trim()) {
      setErrorMessage("Vui lòng điền tiêu đề ứng dụng và nội dung mô tả.");
      return;
    }
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const payload = {
        id: id.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        color,
        platforms,
        ctaLink: ctaLink.trim(),
        status,
        illustrationKey,
        avatarUrl: avatarUrl.trim() || null,
      };

      const method = editId ? "PUT" : "POST";
      const res = await fetch("/api/apps", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lưu ứng dụng thất bại");
      router.push("/apps");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Lỗi khi lưu ứng dụng");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
        Đang tải dữ liệu ứng dụng...
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0 space-y-8">
      <AppsEditorHeader
        isSaving={isSaving}
        onSave={handleSave}
      />

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Full-width Paper Document Canvas - Direct Side-by-Side Split View */}
      <div className="w-full max-w-full min-w-0 bg-white dark:bg-[#0c121e] rounded-3xl p-8 sm:p-12 lg:p-14 shadow-xs border border-zinc-200/70 dark:border-zinc-800/70">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 w-full max-w-full">
          {/* Form Fields Column */}
          <div className="space-y-8">
            {/* Document Headline Title */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Tên Sản phẩm / Ứng dụng
              </label>
              <input
                type="text"
                placeholder="Nhập tên ứng dụng hoặc dịch vụ..."
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full text-2xl sm:text-3xl font-extrabold tracking-tight font-display bg-transparent border-0 border-b border-zinc-200/80 dark:border-zinc-800 pb-2 focus:outline-none focus:border-primary placeholder:text-zinc-300 dark:placeholder:text-zinc-700 text-foreground transition-colors"
              />
            </div>

            {/* Identifier, Category, Illustration, Status */}
            <AppsEditorFields
              id={id}
              setId={setId}
              isEdit={Boolean(editId)}
              category={category}
              setCategory={setCategory}
              color={color}
              setColor={setColor}
              ctaLink={ctaLink}
              setCtaLink={setCtaLink}
              illustrationKey={illustrationKey}
              setIllustrationKey={setIllustrationKey}
              status={status}
              setStatus={setStatus}
            />

            {/* Auto-Resize Description */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Mô tả chi tiết sản phẩm
              </label>
              <AutoResizeTextarea
                minRows={3}
                placeholder="Mô tả các tính năng cốt lõi, giải pháp kỹ thuật và giá trị mang lại cho người dùng..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-sm leading-relaxed border-b border-zinc-200/80 dark:border-zinc-800 pb-3 focus:border-primary"
              />
            </div>

            {/* Avatar Uploader */}
            <div className="pt-2">
              <PaperAvatarUploader
                avatarUrl={avatarUrl}
                setAvatarUrl={setAvatarUrl}
                color={color}
                isUploading={isUploading}
                onFileUpload={handleFileUpload}
              />
            </div>

            {/* Platforms Selector */}
            <div className="pt-2">
              <PaperPlatformsSelector
                platforms={platforms}
                setPlatforms={setPlatforms}
              />
            </div>
          </div>

          {/* Real-Time Live Preview Column (No nested wrapper box or bg) */}
          <div className="lg:border-l lg:border-zinc-100 lg:dark:border-zinc-800/80 lg:pl-12">
            <ProductCardPreview
              name={name}
              category={category}
              description={description}
              color={color}
              platforms={platforms}
              avatarUrl={avatarUrl}
              illustrationKey={illustrationKey}
              status={status}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
