"use client";

import React, { useState, useMemo } from "react";
import { IconMessageCircle, IconSend } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { buildCommentTree } from "@workspace/ui/lib/content-types";
import type { BlogComment } from "@workspace/ui/lib/content-types";
import { CommentThreadItem } from "./comment-thread-item";

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

  const commentTree = useMemo(() => {
    return buildCommentTree(comments);
  }, [comments]);

  const handleRootSubmit = async (e: React.FormEvent) => {
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gửi bình luận thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (
    parentId: string,
    replyAuthor: string,
    replyContent: string,
    replyToAuthor?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          author: replyAuthor,
          content: replyContent,
          parentId,
          replyToAuthor,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi phản hồi thất bại");

      if (data.comment) {
        setComments((prev) => [...prev, data.comment]);
        return true;
      }
      return false;
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gửi phản hồi thất bại");
      return false;
    }
  };

  return (
    <section className="space-y-6 pt-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconMessageCircle className="size-5 text-primary" />
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Thảo luận & Phản hồi ({comments.length})
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {commentTree.length} chủ đề
        </span>
      </div>

      {/* Root Comment Form */}
      <form
        onSubmit={handleRootSubmit}
        className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0c121e] border border-slate-200/80 dark:border-white/[0.06] space-y-3 text-xs"
      >
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
          placeholder="Chia sẻ góc nhìn, phản biện hoặc thắc mắc của bạn về kiến trúc này..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-xl bg-white dark:bg-[#131b2e] p-3 text-xs text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-white/[0.1] focus:ring-primary focus:outline-hidden resize-none"
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="gap-1.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer px-4"
          >
            <IconSend className="size-3.5" />
            <span>{isSubmitting ? "Đang gửi..." : "Gửi bình luận"}</span>
          </Button>
        </div>
      </form>

      {/* Deep Nested Comment Threads List */}
      <div className="space-y-4 pt-2">
        {commentTree.length === 0 ? (
          <p className="py-8 text-center text-xs text-slate-500 italic bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl border border-dashed border-slate-200 dark:border-white/[0.06]">
            Chưa có bình luận nào. Hãy là người đầu tiên để lại ý kiến thảo luận!
          </p>
        ) : (
          commentTree.map((thread) => (
            <CommentThreadItem
              key={thread.id}
              comment={thread}
              depth={0}
              onReply={handleReply}
            />
          ))
        )}
      </div>
    </section>
  );
}
