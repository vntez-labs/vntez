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
    <div className="space-y-6 max-w-7xl min-w-0 w-full max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Hệ sinh thái VNTEZ</span>
            <span>•</span>
            <span>{apps.length} Ứng dụng đã cấu hình</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
            Quản lý Ứng dụng & Sản phẩm
          </h1>
          <p className="text-xs text-muted-foreground">
            Đăng ký, upload avatar, cấu hình nền tảng hỗ trợ và hiển thị dữ liệu trực tiếp trên trang Sản phẩm.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchApps}
            disabled={isLoading}
            className="h-9 gap-1.5 text-xs bg-white dark:bg-card border-0 shadow-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          <Button onClick={handleCreate} size="sm" className="h-9 gap-1.5 text-xs shadow-xs">
            <Plus className="h-4 w-4" />
            <span>Thêm Ứng dụng</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-card p-3 rounded-2xl shadow-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tên, ID, mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900/50 text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              selectedCategory === "all"
                ? "bg-primary text-white"
                : "bg-zinc-100 text-muted-foreground hover:text-foreground dark:bg-zinc-800"
            }`}
          >
            Tất cả ({apps.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-white"
                  : "bg-zinc-100 text-muted-foreground hover:text-foreground dark:bg-zinc-800"
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
