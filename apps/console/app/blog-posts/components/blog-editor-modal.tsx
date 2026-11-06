"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Sparkles, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { BlogPostItem, BlogComment } from "@workspace/ui/lib/content-types";
import { MarkdownPreview } from "./markdown-preview";
import { MarkdownToolbar } from "./markdown-toolbar";
import { BlogMetadataForm } from "./blog-metadata-form";
import { BlogCommentsManager } from "./blog-comments-manager";

interface BlogEditorModalProps {
  isOpen: boolean;
  initialPost: BlogPostItem | null;
  onClose: () => void;
  onSaved: (post: BlogPostItem) => void;
}

export function BlogEditorModal({ isOpen, initialPost, onClose, onSaved }: BlogEditorModalProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "comments">("edit");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Kiến trúc hệ thống");
  const [author, setAuthor] = useState("Engineering Team");
  const [readTime, setReadTime] = useState("5 phút đọc");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [viewsCount, setViewsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [comments, setComments] = useState<BlogComment[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title);
      setSlug(initialPost.slug);
      setExcerpt(initialPost.excerpt);
      setContent(initialPost.content);
      setCategory(initialPost.category);
      setAuthor(initialPost.author);
      setReadTime(initialPost.readTime);
      setThumbnailUrl(initialPost.thumbnailUrl || "");
      setViewsCount(initialPost.viewsCount || 0);
      setLikesCount(initialPost.likesCount || 0);
      setStatus(initialPost.status || "published");
      setComments(initialPost.comments || []);
    } else {
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("# Tiêu đề bài viết mới\n\nNội dung bài viết bắt đầu tại đây...");
      setCategory("Kiến trúc hệ thống");
      setAuthor("Engineering Team");
      setReadTime("5 phút đọc");
      setThumbnailUrl("");
      setViewsCount(0);
      setLikesCount(0);
      setStatus("published");
      setComments([]);
    }
    setActiveTab("edit");
    setError(null);
  }, [initialPost, isOpen]);

  if (!isOpen) return null;

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);
    const replacement = `${prefix}${selected || "văn bản"}${suffix}`;
    const nextText = text.substring(0, start) + replacement + text.substring(end);
    setContent(nextText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 7));
    }, 50);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/blog/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tải ảnh thất bại");
      setThumbnailUrl(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Bạn có chắc muốn xóa bình luận này?")) return;
    try {
      const res = await fetch(`/api/blog/comments?slug=${encodeURIComponent(slug)}&commentId=${encodeURIComponent(commentId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xóa comment thất bại");
      setComments(data.comments || []);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const isEdit = Boolean(initialPost);
      const payload: Partial<BlogPostItem> = {
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: title.trim(),
        excerpt: excerpt.trim() || title.trim(),
        content: content.trim(),
        category: category.trim(),
        author: author.trim(),
        readTime: readTime.trim(),
        thumbnailUrl: thumbnailUrl.trim() || null,
        viewsCount: Number(viewsCount) || 0,
        likesCount: Number(likesCount) || 0,
        status,
        comments,
      };

      const res = await fetch("/api/blog", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lưu bài viết thất bại");

      onSaved(data.post);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-[#0c121e] shadow-2xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-foreground">
              {initialPost ? "Chỉnh sửa Bài viết Blog" : "Soạn Bài viết Blog Mới"}
            </h3>
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  activeTab === "edit" ? "bg-white dark:bg-card text-foreground shadow-2xs" : "text-muted-foreground"
                }`}
              >
                Soạn thảo
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  activeTab === "preview" ? "bg-white dark:bg-card text-foreground shadow-2xs" : "text-muted-foreground"
                }`}
              >
                Xem trước Live
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("comments")}
                className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  activeTab === "comments" ? "bg-white dark:bg-card text-foreground shadow-2xs" : "text-muted-foreground"
                }`}
              >
                <MessageSquare className="h-3 w-3" />
                <span>Bình luận ({comments.length})</span>
              </button>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-lg">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="mx-6 mt-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 p-2.5 text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {activeTab === "comments" ? (
            <BlogCommentsManager comments={comments} onDeleteComment={handleDeleteComment} />
          ) : (
            <>
              <BlogMetadataForm
                title={title}
                setTitle={setTitle}
                slug={slug}
                setSlug={setSlug}
                category={category}
                setCategory={setCategory}
                author={author}
                setAuthor={setAuthor}
                readTime={readTime}
                setReadTime={setReadTime}
                status={status}
                setStatus={setStatus}
                viewsCount={viewsCount}
                setViewsCount={setViewsCount}
                likesCount={likesCount}
                setLikesCount={setLikesCount}
                thumbnailUrl={thumbnailUrl}
                setThumbnailUrl={setThumbnailUrl}
                excerpt={excerpt}
                setExcerpt={setExcerpt}
                isUploading={isUploading}
                onFileUpload={handleFileUpload}
                isEdit={Boolean(initialPost)}
              />

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-foreground">
                    {activeTab === "edit" ? "Nội dung bài viết (Markdown)" : "Xem trước bài viết"}
                  </label>
                  {activeTab === "edit" && <MarkdownToolbar onInsert={insertMarkdown} />}
                </div>

                {activeTab === "edit" ? (
                  <textarea
                    ref={textareaRef}
                    rows={12}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/50 p-4 font-mono text-xs text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800 leading-relaxed resize-y"
                    placeholder="# Bắt đầu viết nội dung bằng Markdown..."
                  />
                ) : (
                  <div className="rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 p-5 ring-1 ring-zinc-200/80 dark:ring-zinc-800 min-h-[300px] overflow-y-auto max-h-[450px]">
                    <MarkdownPreview content={content} />
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSaving}>
              Đóng
            </Button>
            <Button type="submit" size="sm" disabled={isSaving} className="gap-1.5 shadow-xs">
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              <span>{isSaving ? "Đang lưu..." : initialPost ? "Cập nhật bài viết" : "Xuất bản bài viết"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
