"use client";

import React from "react";
import { Edit2, Trash2, ExternalLink, Eye, Heart, MessageSquare, Newspaper } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { BlogPostItem } from "@workspace/ui/lib/content-types";
import { getPublicBlogPostUrl } from "@/lib/portal-url";

interface BlogCardProps {
  post: BlogPostItem;
  onEdit: (post: BlogPostItem) => void;
  onDelete: (slug: string) => void;
}

export function BlogCard({ post, onEdit, onDelete }: BlogCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-card p-5 shadow-xs hover:shadow-md transition-all duration-200 border border-border">
      <div className="space-y-3.5">
        {/* Thumbnail Frame with embedded Badges */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted group shadow-2xs border border-border/40">
          {post.thumbnailUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.thumbnailUrl}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Soft overlay gradient for optimal badge contrast */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30 pointer-events-none" />
            </>
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-white/90 shadow-2xs relative"
              style={{ backgroundColor: post.color || "#fb291a" }}
            >
              <Newspaper className="h-10 w-10 opacity-70" />
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            </div>
          )}

          {/* Badges embedded directly inside thumbnail */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10 gap-2">
            {post.category ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-black/60 text-white backdrop-blur-md shadow-xs border border-white/20">
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: post.color || "#fb291a" }}
                />
                {post.category}
              </span>
            ) : (
              <span />
            )}

            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold backdrop-blur-md shadow-xs ${
                post.status === "published"
                  ? "bg-emerald-600/90 text-white border border-emerald-400/30"
                  : "bg-black/60 text-zinc-300 border border-white/20"
              }`}
            >
              {post.status === "published" ? "Xuất bản" : "Bản nháp"}
            </span>
          </div>
        </div>

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
      <div className="mt-4 pt-3 flex items-center justify-between border-t border-border text-xs">
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
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Xem bài viết trên Web Portal"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(post)}
            className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
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
