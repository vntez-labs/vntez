"use client";

import React, { useState } from "react";
import { IconUser, IconCornerDownRight, IconHeart, IconSend, IconX } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import type { BlogComment } from "@workspace/ui/lib/content-types";

interface CommentThreadItemProps {
  comment: BlogComment;
  depth?: number;
  onReply: (parentId: string, author: string, content: string, replyToAuthor?: string) => Promise<boolean>;
}

export function CommentThreadItem({
  comment,
  depth = 0,
  onReply,
}: CommentThreadItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likes, setLikes] = useState(comment.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleToggleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikes((prev) => Math.max(0, prev - 1));
    } else {
      setHasLiked(true);
      setLikes((prev) => prev + 1);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyAuthor.trim() || !replyContent.trim()) return;

    setIsSubmitting(true);
    const success = await onReply(comment.id, replyAuthor.trim(), replyContent.trim(), comment.author);
    setIsSubmitting(false);

    if (success) {
      setReplyContent("");
      setIsReplying(false);
    }
  };

  const formattedDate = new Date(comment.createdAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-3">
      {/* Comment Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0c121e] border border-slate-200/70 dark:border-white/[0.06] shadow-2xs space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            {comment.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={comment.avatar}
                alt={comment.author}
                className="size-7 rounded-full object-cover ring-1 ring-primary/20"
              />
            ) : (
              <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px] font-mono">
                <IconUser className="size-3.5" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <strong className="font-semibold text-slate-900 dark:text-white">
                {comment.author}
              </strong>
              {comment.replyToAuthor && (
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <IconCornerDownRight className="size-3 text-primary opacity-70" />
                  <span className="text-primary font-medium">@{comment.replyToAuthor}</span>
                </span>
              )}
            </div>
          </div>

          <span className="text-[10px] font-mono text-slate-400">
            {formattedDate}
          </span>
        </div>

        {/* Content */}
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
          {comment.content}
        </p>

        {/* Action bar: Like & Reply */}
        <div className="flex items-center gap-3 pt-1 pl-9">
          <button
            type="button"
            onClick={handleToggleLike}
            className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
              hasLiked ? "text-rose-600 font-semibold" : "text-slate-400 hover:text-rose-500"
            }`}
          >
            <IconHeart className={`size-3.5 ${hasLiked ? "fill-rose-500 text-rose-500" : ""}`} />
            <span>{likes > 0 ? likes : "Thích"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsReplying(!isReplying)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer"
          >
            <IconCornerDownRight className="size-3.5" />
            <span>{isReplying ? "Hủy trả lời" : "Trả lời"}</span>
          </button>
        </div>

        {/* Inline Reply Form */}
        {isReplying && (
          <form
            onSubmit={handleSendReply}
            className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#131b2e]/60 border border-slate-200/80 dark:border-white/[0.08] space-y-2.5 ml-9 animate-in fade-in duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <span>Trả lời cho</span>
                <span className="text-primary font-bold">@{comment.author}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <IconX className="size-3.5" />
              </button>
            </div>

            <input
              type="text"
              required
              placeholder="Tên của bạn *"
              value={replyAuthor}
              onChange={(e) => setReplyAuthor(e.target.value)}
              className="w-full rounded-lg bg-white dark:bg-[#0c121e] px-3 py-1.5 text-xs text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-white/[0.1] focus:ring-primary focus:outline-hidden"
            />

            <textarea
              rows={2}
              required
              placeholder={`Viết phản hồi cho @${comment.author}...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full rounded-lg bg-white dark:bg-[#0c121e] p-2.5 text-xs text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-white/[0.1] focus:ring-primary focus:outline-hidden resize-none"
            />

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(false)}
                className="h-7 text-xs cursor-pointer px-2.5"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-7 text-xs gap-1.5 px-3 cursor-pointer shadow-2xs font-semibold"
              >
                <IconSend className="size-3" />
                <span>{isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}</span>
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Nested Child Replies Tree */}
      {comment.replies && comment.replies.length > 0 && (
        <div
          className={`space-y-3 ${
            depth < 3
              ? "border-l-2 border-slate-200/80 dark:border-white/[0.08] ml-4 sm:ml-6 pl-3 sm:pl-4"
              : "ml-2 sm:ml-3 pl-2 sm:pl-3"
          }`}
        >
          {comment.replies.map((reply) => (
            <CommentThreadItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
