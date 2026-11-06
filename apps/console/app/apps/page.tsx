"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { Plus, Search, Layers, RefreshCw } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { AppItem } from "@workspace/ui/lib/content-types";
import { AppCard } from "./components/app-card";

export default function AppsPage() {
  return (
    <AuthGuard>
      <ConsoleShell>
        <AppsManagementContent />
      </ConsoleShell>
    </AuthGuard>
  );
}

function AppsManagementContent() {
  const router = useRouter();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const fetchApps = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/apps");
      const data = await res.json();
      if (data.success && Array.isArray(data.apps)) {
        setApps(data.apps);
      }
    } catch (err) {
      console.error("Failed to load apps:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    apps.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set);
  }, [apps]);

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchSearch =
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === "all" || app.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [apps, searchTerm, selectedCategory]);

  const handleEdit = (app: AppItem) => {
    router.push(`/apps/editor?id=${encodeURIComponent(app.id)}`);
  };

  const handleCreate = () => {
    router.push("/apps/editor");
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa app [${id}]?`)) return;

    try {
      const res = await fetch(`/api/apps?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xóa thất bại");
      setApps((prev) => prev.filter((a) => a.id !== id));
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
            <span className="font-semibold text-foreground">Hệ sinh thái VNTEZ</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="text-primary font-semibold">{apps.length} Ứng dụng đã cấu hình</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display leading-tight">
            Quản lý Ứng dụng & Sản phẩm
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl pt-1">
            Đăng ký, upload avatar, cấu hình nền tảng hỗ trợ và hiển thị dữ liệu trực tiếp trên trang Sản phẩm.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchApps}
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
            <span>Thêm Ứng dụng</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar without nested card wrappers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tên, ID, mô tả..."
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
            Tất cả ({apps.length})
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

      {/* Grid of Apps */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center rounded-2xl bg-white dark:bg-card shadow-xs text-xs text-muted-foreground">
          Đang tải danh sách ứng dụng...
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 p-12 rounded-2xl bg-white dark:bg-card shadow-xs text-center">
          <Layers className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-xs font-medium text-foreground">Không tìm thấy ứng dụng phù hợp</p>
          <p className="text-xs text-muted-foreground">Nhấn "Thêm Ứng dụng" để khởi tạo sản phẩm mới.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Edit / Create Modal removed in favor of dedicated full-page editor at /apps/editor */}
    </div>
  );
}
