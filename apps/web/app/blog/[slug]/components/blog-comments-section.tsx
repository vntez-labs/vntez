"use client";

import React, { useState } from "react";
import { IconMessageCircle, IconSend, IconUser } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import type { BlogComment } from "@workspace/ui/lib/content-types";

interface BlogCommentsSectionProps {
  slug: string;
  initialComments: BlogComment[];
}

export function BlogCommentsSection({ slug, initialComments }: BlogCommentsSectionProps) {
  const [comments, setComments] = useState<BlogComment[]>(initialComments || []);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      setError("Vui lòng nhập tên của bạn và nội dung bình luận.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, author, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi bình luận thất bại");

      if (data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setContent("");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6 pt-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <IconMessageCircle className="size-5 text-primary" />
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
          Thảo luận ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0c121e] border border-slate-200/80 dark:border-white/[0.06] space-y-3 text-xs">
        <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
          Để lại ý kiến hoặc câu hỏi của bạn
        </span>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            placeholder="Tên của bạn *"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-xl bg-white dark:bg-[#131b2e] px-3 py-2 text-xs text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-white/[0.1] focus:ring-primary focus:outline-hidden"
          />
        </div>

        <textarea
          rows={3}
          required
          placeholder="Chia sẻ góc nhìn hoặc thắc mắc của bạn về kiến trúc này..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-xl bg-white dark:bg-[#131b2e] p-3 text-xs text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-white/[0.1] focus:ring-primary focus:outline-hidden resize-none"
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="gap-1.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <IconSend className="size-3.5" />
            <span>{isSubmitting ? "Đang gửi..." : "Gửi bình luận"}</span>
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3 pt-2">
        {comments.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-500 italic">
            Chưa có bình luận nào. Hãy là người đầu tiên để lại ý kiến!
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-white dark:bg-[#0c121e] border border-slate-200/60 dark:border-white/[0.06] space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                    <IconUser className="size-3.5" />
                  </div>
                  <strong className="font-semibold text-slate-900 dark:text-white">
                    {c.author}
                  </strong>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(c.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
                {c.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
