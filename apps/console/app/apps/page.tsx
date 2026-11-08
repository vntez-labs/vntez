"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { Search, Layers } from "lucide-react";
import { CardSkeleton } from "@workspace/ui/components/skeleton";
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

  const filteredApps = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return apps.filter((app) => {
      return (
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.id.toLowerCase().includes(q) ||
        (app.url && app.url.toLowerCase().includes(q))
      );
    });
  }, [apps, searchTerm]);

  const handleEdit = (app: AppItem) => {
    router.push(`/apps/${encodeURIComponent(app.id)}`);
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
      <div className="pb-6 border-b border-border">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
            <span className="font-semibold text-foreground">Hệ sinh thái VNTEZ</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="text-primary font-semibold">{apps.length} Ứng dụng</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display leading-tight">
            Quản lý Ứng dụng & Sản phẩm
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
            Đăng ký, upload avatar, cấu hình nền tảng hỗ trợ và hiển thị dữ liệu trực tiếp trên trang Sản phẩm.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tên, ID, mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-card text-foreground border border-input shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          Hiển thị <strong>{filteredApps.length}</strong> / {apps.length} ứng dụng
        </div>
      </div>

      {/* Grid of Apps */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
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
