"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { Search, Newspaper, Eye, Heart, MessageSquare, Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { CardSkeleton } from "@workspace/ui/components/skeleton";
import { api } from "@workspace/ui/lib/api-client";
import { toast } from "@workspace/ui/components/toaster";
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
      const data = await api.get<{ success: boolean; posts: BlogPostItem[] }>("/api/blog");
      if (data.success && Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error("Failed to load blog posts:", err);
      toast.error("Không thể tải danh sách bài viết");
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
      await api.delete(`/api/blog?slug=${encodeURIComponent(slug)}`);
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
      toast.success(`Đã xóa bài viết [${slug}] thành công!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xóa bài viết thất bại";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Newspaper className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-foreground">
              Quản trị Bài viết & Blog
            </h1>
            <span className="bg-primary/10 text-primary text-xs font-mono font-semibold px-2 py-0.5 rounded-full">
              {posts.length} bài
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            onClick={handleCreate}
            className="gap-1.5 text-xs shadow-xs cursor-pointer font-semibold bg-primary hover:bg-primary-hover text-white h-9 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            <span>Viết bài mới</span>
          </Button>
        </div>
      </div>

      {/* Summary Stats Row - Compact & High-density */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-muted-foreground font-medium">Tổng bài viết</span>
            <div className="text-xl font-bold font-display text-foreground">{stats.total}</div>
          </div>
          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
            <Newspaper className="h-4 w-4" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-muted-foreground font-medium">Tổng lượt xem</span>
            <div className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
              {stats.views.toLocaleString()}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
            <Eye className="h-4 w-4" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-muted-foreground font-medium">Tổng lượt tim</span>
            <div className="text-xl font-bold font-mono text-rose-500">
              {stats.likes.toLocaleString()}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 shrink-0">
            <Heart className="h-4 w-4" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-muted-foreground font-medium">Tổng bình luận</span>
            <div className="text-xl font-bold font-mono text-amber-500">
              {stats.comments.toLocaleString()}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
            <MessageSquare className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, slug, tóm tắt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-4 text-xs rounded-xl bg-card text-foreground border border-input shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-card border border-border shadow-2xs">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-white shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Tất cả ({posts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-white shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 p-12 rounded-2xl bg-card border border-border shadow-xs text-center">
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
