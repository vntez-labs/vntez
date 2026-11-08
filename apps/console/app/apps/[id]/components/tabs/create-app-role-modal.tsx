"use client";

import React, { useState } from "react";
import { IconPlus, IconX, IconShieldCheck } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import type { AppRole } from "@workspace/ui/lib/content-types";

interface CreateAppRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRole: (role: AppRole) => void;
}

export function CreateAppRoleModal({ isOpen, onClose, onAddRole }: CreateAppRoleModalProps) {
  const [roleId, setRoleId] = useState("");
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      setError("Tên vai trò không được để trống");
      return;
    }

    const cleanId = (roleId.trim() || roleName.trim())
      .toLowerCase()
      .replace(/[^a-z0-9_]+/g, "_")
      .replace(/^_+|_+$/g, "");

    onAddRole({
      id: cleanId,
      name: roleName.trim(),
      description: description.trim() || `Vai trò ${roleName.trim()}`,
      isSystem: false,
    });

    setRoleId("");
    setRoleName("");
    setDescription("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0c121e] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <IconShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold font-display text-foreground">
              Thêm Vai trò Mới (Per-App Role)
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
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tên Vai trò (Role Name)
            </label>
            <input
              type="text"
              placeholder="ví dụ: Quản lý Thanh toán (Billing Admin)"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-primary"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mã Định danh (Role ID - Slug)
            </label>
            <input
              type="text"
              placeholder="billing_admin"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-primary font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mô tả Vai trò
            </label>
            <input
              type="text"
              placeholder="Phụ trách đối soát giao dịch và hóa đơn"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 px-3 text-xs rounded-xl cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 px-4 text-xs font-semibold rounded-xl cursor-pointer"
            >
              <IconPlus className="h-3.5 w-3.5 mr-1" />
              Tạo vai trò
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
