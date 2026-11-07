"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import type { BlogPostItem } from "@workspace/ui/lib/content-types";
import { BlogEditorHeader, type EditorViewMode } from "./components/blog-editor-header";
import { PaperBlogMeta } from "./components/paper-blog-meta";
import { BlogWorkspacePanes } from "./components/blog-workspace-panes";
import { BlogCommentsManager } from "../components/blog-comments-manager";

function computeReadTime(text: string): string {
  const clean = text.replace(/```[\s\S]*?```/g, "").replace(/[#*`_~>[\]()]/g, "").trim();
  const words = clean ? clean.split(/\s+/).filter(Boolean).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} phút đọc`;
}

export default function BlogEditorPage() {
  return (
    <AuthGuard>
      <ConsoleShell>
        <Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Đang tải trình soạn thảo...</div>}>
          <BlogEditorContent />
        </Suspense>
      </ConsoleShell>
    </AuthGuard>
  );
}

function BlogEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("slug");

  const [isLoading, setIsLoading] = useState(Boolean(editSlug));
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Layout View Controls
  const [viewMode, setViewMode] = useState<EditorViewMode>("split");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMeta, setShowMeta] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Kiến trúc hệ thống");
  const [author, setAuthor] = useState("Core Engineering Team");
  const [readTime, setReadTime] = useState("5 phút đọc");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [illustrationKey, setIllustrationKey] = useState<BlogPostItem["illustrationKey"]>("offline");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [viewsCount, setViewsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<BlogPostItem["comments"]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!editSlug) return;
    async function loadTargetPost() {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        if (data.success && Array.isArray(data.posts)) {
          const found = data.posts.find((p: BlogPostItem) => p.slug === editSlug);
          if (found) {
            setTitle(found.title);
            setSlug(found.slug);
            setExcerpt(found.excerpt || "");
            setContent(found.content || "");
            setCategory(found.category || "Kiến trúc hệ thống");
            setAuthor(found.author || "Core Engineering Team");
            setReadTime(found.readTime || "5 phút đọc");
            setStatus(found.status || "published");
            setIllustrationKey(found.illustrationKey || "offline");
            setThumbnailUrl(found.thumbnailUrl || "");
            setViewsCount(found.viewsCount || 0);
            setLikesCount(found.likesCount || 0);
            setComments(found.comments || []);
          }
        }
      } catch (err) {
        console.error("Failed to load post:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTargetPost();
  }, [editSlug]);

  const handleInsert = (prefix: string, suffix = "") => {
    const el = textareaRef.current;
    if (!el) {
      setContent((prev) => prev + prefix + suffix);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = prefix + selected + suffix;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setReadTime(computeReadTime(newContent));
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setErrorMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/blog/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload thất bại");
      setThumbnailUrl(data.url);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Upload thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setErrorMessage("Vui lòng nhập tiêu đề và nội dung bài viết.");
      return;
    }
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const payload: BlogPostItem = {
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: title.trim(),
        excerpt: excerpt.trim() || content.slice(0, 150) + "...",
        content,
        category: category.trim(),
        author: author.trim(),
        date: new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }),
        readTime: readTime.trim(),
        color: "#fb291a",
        commentsCount: comments?.length || 0,
        likesCount,
        viewsCount,
        illustrationKey,
        thumbnailUrl: thumbnailUrl.trim() || null,
        status,
        comments,
        updatedAt: new Date().toISOString(),
      };

      const method = editSlug ? "PUT" : "POST";
      const res = await fetch("/api/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          originalSlug: editSlug || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lưu bài viết thất bại");
      router.push("/blog-posts");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Lỗi khi lưu bài viết");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
        Đang tải bài viết...
      </div>
    );
  }

  const editorLayout = (
    <div className={`w-full max-w-full min-w-0 flex flex-col ${isFullscreen ? "h-full" : "space-y-6"}`}>
      <BlogEditorHeader
        isSaving={isSaving}
        onSave={handleSave}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
        showMeta={showMeta}
        onToggleMeta={() => setShowMeta((prev) => !prev)}
      />

      {errorMessage && (
        <div className="p-3 my-2 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs shrink-0">
          {errorMessage}
        </div>
      )}

      {/* Collapsible Metadata Section */}
      {showMeta && (
        <div className={`w-full bg-white dark:bg-[#0c121e] rounded-2xl p-6 sm:p-8 shadow-xs border border-zinc-200/80 dark:border-zinc-800 ${isFullscreen ? "shrink-0 max-h-56 overflow-y-auto mb-3" : ""}`}>
          <PaperBlogMeta
            title={title}
            setTitle={setTitle}
            slug={slug}
            setSlug={setSlug}
            excerpt={excerpt}
            setExcerpt={setExcerpt}
            category={category}
            setCategory={setCategory}
            author={author}
            setAuthor={setAuthor}
            readTime={readTime}
            setReadTime={setReadTime}
            status={status}
            setStatus={setStatus}
            illustrationKey={illustrationKey}
            setIllustrationKey={setIllustrationKey}
            thumbnailUrl={thumbnailUrl}
            setThumbnailUrl={setThumbnailUrl}
            isUploading={isUploading}
            onFileUpload={handleFileUpload}
            isEdit={Boolean(editSlug)}
          />
        </div>
      )}

      {/* Main Workspace (Editor + Live Preview Panes) */}
      <BlogWorkspacePanes
        viewMode={viewMode}
        isFullscreen={isFullscreen}
        content={content}
        onChangeContent={(newVal) => {
          setContent(newVal);
          setReadTime(computeReadTime(newVal));
        }}
        textareaRef={textareaRef}
        onInsert={handleInsert}
        meta={{
          title,
          category,
          author,
          readTime,
          thumbnailUrl,
        }}
      />

      {/* Comments Manager (Only shown when editing an existing post and not fullscreen) */}
      {!isFullscreen && Boolean(editSlug) && (
        <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800">
          <BlogCommentsManager
            comments={comments || []}
            onDeleteComment={(commentId) => {
              setComments((prev) => (prev || []).filter((c) => c.id !== commentId));
            }}
          />
        </div>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#fbf9f5] dark:bg-[#080c14] flex flex-col p-4 sm:p-6 overflow-hidden">
        {editorLayout}
      </div>
    );
  }

  return editorLayout;
}
