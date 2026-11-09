"use client";

import React from "react";
import { X, Layers, Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { usePermissionsStore } from "../permissions-store";

export function CreateResourceModal() {
  const {
    isCreateResourceOpen,
    closeCreateResourceModal,
    newResourceName,
    newResourceDescription,
    setNewResourceName,
    setNewResourceDescription,
    handleCreateResource,
  } = usePermissionsStore();

  React.useEffect(() => {
    if (!isCreateResourceOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCreateResourceModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCreateResourceOpen, closeCreateResourceModal]);

  if (!isCreateResourceOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCreateResourceModal();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
    >
      <div className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Thêm Tài Nguyên Root (Resource)</h3>
              <p className="text-[11px] text-muted-foreground font-mono">
                Phạm vi: Hệ sinh thái Toàn cục (app_id: null)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCreateResourceModal}
            className="text-muted-foreground hover:text-foreground cursor-pointer rounded-full p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mã Định Danh Resource *
            </label>
            <input
              type="text"
              autoFocus
              value={newResourceName}
              onChange={(e) => setNewResourceName(e.target.value)}
              placeholder="VD: database, analytics, storage, webhooks..."
              className="w-full h-9 rounded-xl border border-input bg-muted/40 px-3 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <span className="text-[10px] text-muted-foreground mt-1 block">
              Tự động chuẩn hóa dạng chữ thường và snake_case
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mô tả Tài nguyên (Tùy chọn)
            </label>
            <textarea
              rows={2}
              value={newResourceDescription}
              onChange={(e) => setNewResourceDescription(e.target.value)}
              placeholder="VD: Quản trị tài nguyên cơ sở dữ liệu Postgres..."
              className="w-full rounded-xl border border-input bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={closeCreateResourceModal}
            className="rounded-xl text-xs"
          >
            Hủy
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleCreateResource}
            disabled={!newResourceName.trim()}
            className="rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm Resource</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
