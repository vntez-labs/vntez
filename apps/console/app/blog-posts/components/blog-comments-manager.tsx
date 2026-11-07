"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { BlogComment } from "@workspace/ui/lib/content-types";

interface BlogCommentsManagerProps {
  comments: BlogComment[];
  onDeleteComment: (commentId: string) => void;
}

export function BlogCommentsManager({ comments, onDeleteComment }: BlogCommentsManagerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <span className="font-semibold text-foreground">Danh sách phản hồi từ độc giả</span>
        <span className="text-muted-foreground">{comments.length} bình luận</span>
      </div>
      {comments.length === 0 ? (
        <div className="py-12 text-center text-xs text-muted-foreground">
          Chưa có bình luận nào trên bài viết này.
        </div>
      ) : (
        <div className="space-y-2.5">
          {comments.map((c) => (
            <div
              key={c.id}
              className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 ${
                c.parentId
                  ? "bg-zinc-100/50 dark:bg-zinc-900/60 ml-4 sm:ml-6"
                  : "bg-zinc-50 dark:bg-zinc-900/30"
              }`}
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-foreground text-xs">{c.author}</strong>
                  {c.replyToAuthor && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
                      ↳ Phản hồi @{c.replyToAuthor}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {new Date(c.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">{c.content}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onDeleteComment(c.id)}
                className="h-7 w-7 p-0 text-rose-500 hover:bg-rose-500/10 cursor-pointer shrink-0"
                title="Xóa bình luận"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
