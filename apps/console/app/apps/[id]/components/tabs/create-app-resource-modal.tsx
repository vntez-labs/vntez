"use client";

import React, { useState } from "react";
import { IconLayersIntersect, IconX, IconPlus } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";

interface CreateAppResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (resourceName: string) => void;
}

export function CreateAppResourceModal({
  isOpen,
  onClose,
  onAddResource,
}: CreateAppResourceModalProps) {
  const [resourceName, setResourceName] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = resourceName.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
    if (!clean) {
      setError("Mã tài nguyên không được để trống");
      return;
    }

    onAddResource(clean);
    setResourceName("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <IconLayersIntersect className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold font-display text-foreground">
              Thêm Tài Nguyên Cho App (Resource)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-destructive/10 text-xs text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mã Định Danh Resource *
            </label>
            <input
              type="text"
              placeholder="ví dụ: documents, lessons, snippets, billing..."
              value={resourceName}
              onChange={(e) => setResourceName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-muted/40 border border-input focus:outline-none focus:border-primary font-mono text-foreground"
              autoFocus
            />
            <span className="text-[10px] text-muted-foreground mt-1 block">
              Tự động chuẩn hóa dạng chữ thường và snake_case
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} className="rounded-xl text-xs">
              Hủy
            </Button>
            <Button type="submit" size="sm" className="rounded-xl text-xs font-semibold gap-1.5 shadow-xs">
              <IconPlus className="h-3.5 w-3.5" />
              <span>Thêm Resource</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
