"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { Search, Layers, Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { CardSkeleton } from "@workspace/ui/components/skeleton";
import { api } from "@workspace/ui/lib/api-client";
import { toast } from "@workspace/ui/components/toaster";
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
      const data = await api.get<{ success: boolean; apps: AppItem[] }>("/api/apps");
      if (data.success && Array.isArray(data.apps)) {
        setApps(data.apps);
      }
    } catch (err) {
      console.error("Failed to load apps:", err);
      toast.error("Không thể tải danh sách ứng dụng");
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
      await api.delete(`/api/apps?id=${encodeURIComponent(id)}`);
      setApps((prev) => prev.filter((a) => a.id !== id));
      toast.success(`Đã xóa app [${id}] thành công`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xóa thất bại";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Layers className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-foreground">
              Quản lý Ứng dụng & Sản phẩm
            </h1>
            <span className="bg-primary/10 text-primary text-xs font-mono font-semibold px-2 py-0.5 rounded-full">
              {apps.length} ứng dụng
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm theo tên, ID, mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-8 pr-3 text-xs bg-card text-foreground border border-input shadow-2xs rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/60 transition-all"
            />
          </div>

          <Button
            size="sm"
            onClick={handleCreate}
            className="gap-1.5 text-xs shadow-xs cursor-pointer font-semibold bg-primary hover:bg-primary-hover text-white h-9 rounded-xl shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm Ứng dụng</span>
          </Button>
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
