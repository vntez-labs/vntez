"use client";

import React from "react";
import { UserCheck, X, Shield, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useUsersStore } from "../users-store";

const AVAILABLE_ROLES = [
  { id: "Admin", label: "Admin", desc: "Toàn quyền quản trị hệ thống" },
  { id: "Developer", label: "Developer", desc: "Truy cập API, Webhooks, R2" },
  { id: "Operator", label: "Operator", desc: "Vận hành dịch vụ và duyệt lệnh" },
  { id: "Viewer", label: "Viewer", desc: "Chỉ xem dữ liệu và báo cáo" },
];

export function UserEditModal() {
  const {
    editingUser,
    closeEditUserModal,
    editFormData,
    setEditFormData,
    handleEditUserSubmit,
    isSubmitting,
    formError,
  } = useUsersStore();

  if (!editingUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-card shadow-2xl rounded-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Chỉnh sửa vai trò & Người dùng
              </h3>
              <p className="text-[11px] font-mono text-muted-foreground truncate max-w-[240px]">
                {editingUser.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeEditUserModal}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleEditUserSubmit} className="space-y-4 text-xs">
          {/* User Full Name */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Tên hiển thị</label>
            <input
              type="text"
              required
              value={editFormData.name}
              onChange={(e) => setEditFormData({ name: e.target.value })}
              className="w-full h-9 px-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground text-xs"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Vai trò hệ thống (Role)</label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {AVAILABLE_ROLES.map((r) => {
                const isSelected = editFormData.role.toLowerCase() === r.id.toLowerCase();
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setEditFormData({ role: r.label })}
                    className={`flex flex-col text-left p-2.5 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? "bg-violet-500/10 text-violet-700 dark:text-violet-300 ring-1 ring-violet-500/40"
                        : "bg-zinc-50 dark:bg-zinc-900/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="font-bold text-xs">{r.label}</span>
                    <span className="text-[10px] opacity-80 mt-0.5">{r.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-1.5 pt-1">
            <label className="font-semibold text-foreground">Trạng thái tài khoản</label>
            <div className="flex items-center gap-3">
              {(["active", "inactive"] as const).map((st) => (
                <label
                  key={st}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                    editFormData.status === st
                      ? st === "active"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      : "bg-zinc-50 dark:bg-zinc-900/40 text-muted-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    checked={editFormData.status === st}
                    onChange={() => setEditFormData({ status: st })}
                    className="hidden"
                  />
                  <span>{st === "active" ? "Hoạt động (Active)" : "Đình chỉ (Inactive)"}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={closeEditUserModal}
              className="rounded-xl text-xs"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              className="gap-1.5 rounded-xl text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
