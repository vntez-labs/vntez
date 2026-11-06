"use client";

import React, { useEffect, useState } from "react";
import { IconHeart, IconEye, IconShare, IconCheck } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";

interface BlogInteractionsProps {
  slug: string;
  initialLikes: number;
  initialViews: number;
}

export function BlogInteractions({ slug, initialLikes, initialViews }: BlogInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [views, setViews] = useState(initialViews);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Auto record view on mount
  useEffect(() => {
    fetch("/api/blog/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.viewsCount) {
          setViews(data.viewsCount);
        }
      })
      .catch(() => {});
  }, [slug]);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    setHasLiked(true);
    setLikes((prev) => prev + 1);

    try {
      const res = await fetch("/api/blog/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (data.success && data.likesCount) {
        setLikes(data.likesCount);
      }
    } catch {
      // Keep optimistic update
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-5 my-8 border-y border-slate-200/80 dark:border-white/[0.08]">
      {/* Views & Likes */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLike}
          disabled={hasLiked}
          className={`h-9 gap-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            hasLiked
              ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900/40 dark:text-rose-400"
              : "hover:text-rose-600"
          }`}
        >
          <IconHeart className={`size-4 ${hasLiked ? "fill-rose-500 text-rose-500 scale-110" : ""}`} />
          <span>{likes} Thả tim</span>
        </Button>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-[#0c121e] text-xs font-mono text-slate-600 dark:text-slate-400">
          <IconEye className="size-3.5 text-cyan-600" />
          <span>{views} Lượt xem</span>
        </span>
      </div>

      {/* Share action */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="h-9 gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
      >
        {copied ? <IconCheck className="size-4 text-emerald-600" /> : <IconShare className="size-4" />}
        <span>{copied ? "Đã chép link!" : "Chia sẻ bài viết"}</span>
      </Button>
    </div>
  );
}
