"use client";

import React from "react";
import { Edit2, Trash2, ExternalLink, Eye, Heart, MessageSquare, Newspaper } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import type { BlogPostItem } from "@workspace/ui/lib/content-types";
import { getPublicBlogPostUrl } from "@/lib/portal-url";

interface BlogCardProps {
  post: BlogPostItem;
  onEdit: (post: BlogPostItem) => void;
  onDelete: (slug: string) => void;
}

export function BlogCard({ post, onEdit, onDelete }: BlogCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white dark:bg-card p-5 shadow-xs hover:shadow-sm transition-all duration-200">
      <div className="space-y-3.5">
        {/* Top: Category & Status */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className="text-[10px] bg-primary/10 text-primary border-0 font-medium"
          >
            {post.category}
          </Badge>

          <Badge
            variant="outline"
            className={`text-[10px] border-0 ${
              post.status === "published"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
            }`}
          >
            {post.status === "published" ? "Xuất bản" : "Bản nháp"}
          </Badge>
        </div>

        {/* Thumbnail (if any) or Banner */}
        {post.thumbnailUrl ? (
          <div className="h-36 w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className="flex h-24 w-full items-center justify-center rounded-xl text-white/90 shadow-2xs"
            style={{ backgroundColor: post.color || "#fb291a" }}
          >
            <Newspaper className="h-8 w-8 opacity-80" />
          </div>
        )}

        {/* Title & Excerpt */}
        <div>
          <h3 className="font-bold text-foreground text-sm line-clamp-2 font-display">
            {post.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Author & Date */}
        <div className="text-[11px] text-muted-foreground flex items-center gap-2">
          <span>{post.author}</span>
          <span>•</span>
          <span>{post.date}</span>
        </div>
      </div>

      {/* Footer: Live Stats & Actions */}
      <div className="mt-4 pt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
        {/* Real counts: Views, Likes, Comments */}
        <div className="flex items-center gap-3 text-muted-foreground font-mono text-[11px]">
          <span className="flex items-center gap-1" title="Lượt xem">
            <Eye className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
            <span>{post.viewsCount || 0}</span>
          </span>
          <span className="flex items-center gap-1" title="Lượt tim">
            <Heart className="h-3 w-3 text-rose-500" />
            <span>{post.likesCount || 0}</span>
          </span>
          <span className="flex items-center gap-1" title="Bình luận">
            <MessageSquare className="h-3 w-3 text-amber-500" />
            <span>{post.commentsCount || (post.comments?.length || 0)}</span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <a
            href={getPublicBlogPostUrl(post.slug)}
            target="_blank"
            rel="noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-zinc-100 hover:text-foreground dark:hover:bg-zinc-800"
            title="Xem bài viết trên Web Portal"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(post)}
            className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground"
            title="Sửa bài viết"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(post.slug)}
            className="h-7 w-7 p-0 rounded-lg text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
            title="Xóa bài viết"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
