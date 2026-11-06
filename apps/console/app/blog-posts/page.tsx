"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { Plus, Search, Newspaper, RefreshCw, Eye, Heart, MessageSquare } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { BlogPostItem } from "@workspace/ui/lib/content-types";
import { BlogCard } from "./components/blog-card";

export default function BlogPostsAdminPage() {
  return (
    <AuthGuard>
      <ConsoleShell>
        <BlogManagementContent />
      </ConsoleShell>
    </AuthGuard>
  );
}

function BlogManagementContent() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error("Failed to load blog posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const stats = useMemo(() => {
    let views = 0;
    let likes = 0;
    let comments = 0;
    posts.forEach((p) => {
      views += p.viewsCount || 0;
      likes += p.likesCount || 0;
      comments += p.commentsCount || (p.comments?.length || 0);
    });
    return { views, likes, comments, total: posts.length };
  }, [posts]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.slug.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === "all" || post.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  const handleEdit = (post: BlogPostItem) => {
    router.push(`/blog-posts/editor?slug=${encodeURIComponent(post.slug)}`);
  };

  const handleCreate = () => {
    router.push("/blog-posts/editor");
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bài viết [${slug}]?`)) return;

    try {
      const res = await fetch(`/api/blog?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xóa bài viết thất bại");
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 min-w-0 w-full max-w-full">
      {/* Header with human-centric spacing and typography hierarchy */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
            <span className="font-semibold text-foreground">vntez Engineering Blog</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="text-primary font-semibold">{posts.length} Bài viết</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display leading-tight">
            Quản trị Bài viết & Blog
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl pt-1">
            Soạn thảo bằng Markdown Editor trực quan, xem trước live, theo dõi lượt xem, lượt tim và quản lý bình luận.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPosts}
            disabled={isLoading}
            className="h-10 px-4 gap-2 text-xs rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-card hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          <Button
            onClick={handleCreate}
            size="sm"
            className="h-10 px-5 gap-2 text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Viết bài mới</span>
          </Button>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 space-y-1">
          <span className="text-[11px] text-muted-foreground font-medium">Tổng bài viết</span>
          <div className="text-xl font-bold font-display text-foreground">{stats.total}</div>
        </div>
        <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 space-y-1">
          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <Eye className="h-3 w-3 text-cyan-600" />
            <span>Tổng lượt xem</span>
          </span>
          <div className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
            {stats.views.toLocaleString()}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 space-y-1">
          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <Heart className="h-3 w-3 text-rose-500" />
            <span>Tổng lượt tim</span>
          </span>
          <div className="text-xl font-bold font-mono text-rose-500">
            {stats.likes.toLocaleString()}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 space-y-1">
          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <MessageSquare className="h-3 w-3 text-amber-500" />
            <span>Tổng bình luận</span>
          </span>
          <div className="text-xl font-bold font-mono text-amber-500">
            {stats.comments.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search and Category Filter without nested card wrappers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, slug, tóm tắt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-zinc-50/80 dark:bg-zinc-900/60 text-foreground border border-zinc-200/80 dark:border-zinc-800 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              selectedCategory === "all"
                ? "bg-primary text-white shadow-xs"
                : "bg-zinc-100 hover:bg-zinc-200 text-muted-foreground hover:text-foreground dark:bg-zinc-800 dark:hover:bg-zinc-700"
            }`}
          >
            Tất cả ({posts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-white shadow-xs"
                  : "bg-zinc-100 hover:bg-zinc-200 text-muted-foreground hover:text-foreground dark:bg-zinc-800 dark:hover:bg-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center rounded-2xl bg-white dark:bg-card shadow-xs text-xs text-muted-foreground">
          Đang tải bài viết...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 p-12 rounded-2xl bg-white dark:bg-card shadow-xs text-center">
          <Newspaper className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-xs font-medium text-foreground">Không tìm thấy bài viết</p>
          <p className="text-xs text-muted-foreground">Nhấn "Viết bài mới" để soạn bài viết đầu tiên.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Blog Editor Modal removed in favor of dedicated full-page editor at /blog-posts/editor */}
    </div>
  );
}
