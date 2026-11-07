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

  // Restore liked state from localStorage & record live view
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`vntez_liked_${slug}`);
      if (stored) setHasLiked(true);
    }

    fetch("/api/blog/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && typeof data.viewsCount === "number") {
          setViews(data.viewsCount);
        }
      })
      .catch(() => {});
  }, [slug]);

  const handleToggleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    const nextLiked = !hasLiked;
    const action = nextLiked ? "like" : "unlike";

    // Optimistic UI update
    setHasLiked(nextLiked);
    setLikes((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    if (typeof window !== "undefined") {
      if (nextLiked) {
        localStorage.setItem(`vntez_liked_${slug}`, "1");
      } else {
        localStorage.removeItem(`vntez_liked_${slug}`);
      }
    }

    try {
      const res = await fetch("/api/blog/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action }),
      });
      const data = await res.json();
      if (data.success && typeof data.likesCount === "number") {
        setLikes(data.likesCount);
      }
    } catch {
      // Retain optimistic state on network failure
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
          onClick={handleToggleLike}
          disabled={isLiking}
          className={`h-9 gap-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            hasLiked
              ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900/40 dark:text-rose-400"
              : "hover:text-rose-600"
          }`}
          title={hasLiked ? "Nhấn để bỏ thích bài viết" : "Nhấn để thả tim bài viết"}
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
