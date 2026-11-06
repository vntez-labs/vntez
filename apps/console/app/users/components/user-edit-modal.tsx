"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, X, Shield, AlertTriangle, Loader2, Check } from "lucide-react";
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

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      closeEditUserModal();
    }, 150);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!editingUser) return null;

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-150 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white dark:bg-card shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden border border-border transform transition-all duration-150 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-5 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-display">
                Chỉnh sửa vai trò & Người dùng
              </h3>
              <p className="text-xs font-mono text-muted-foreground truncate max-w-[280px] mt-0.5">
                {editingUser.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {formError && (
          <div className="mx-6 mt-5 p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form Body with generous spacing */}
        <form onSubmit={handleEditUserSubmit} className="p-6 space-y-7 text-xs">
          {/* User Full Name */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Tên hiển thị</span>
              <span className="font-normal text-[10px] text-muted-foreground/60 lowercase tracking-normal">Bắt buộc</span>
            </label>
            <input
              type="text"
              required
              value={editFormData.name}
              onChange={(e) => setEditFormData({ name: e.target.value })}
              className="w-full h-11 px-4 bg-secondary/30 dark:bg-zinc-900/60 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm font-medium transition-all placeholder:text-muted-foreground/40"
              placeholder="Nhập tên người dùng..."
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Vai trò hệ thống (Role)
            </label>
            <div className="grid grid-cols-2 gap-3 pt-0.5">
              {AVAILABLE_ROLES.map((r) => {
                const isSelected = editFormData.role.toLowerCase() === r.id.toLowerCase();
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setEditFormData({ role: r.label })}
                    className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary/5 border-primary text-foreground ring-1 ring-primary/30 shadow-xs"
                        : "bg-secondary/30 dark:bg-zinc-900/40 border-border text-muted-foreground hover:bg-secondary/70 hover:text-foreground hover:border-border/80"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`font-bold text-xs ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {r.label}
                      </span>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                      {r.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Trạng thái tài khoản
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["active", "inactive"] as const).map((st) => {
                const isChecked = editFormData.status === st;
                return (
                  <label
                    key={st}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                      isChecked
                        ? "bg-primary/5 border-primary text-foreground ring-1 ring-primary/30 shadow-xs"
                        : "bg-secondary/30 dark:bg-zinc-900/40 border-border text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      checked={isChecked}
                      onChange={() => setEditFormData({ status: st })}
                      className="hidden"
                    />
                    <span
                      className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                        st === "active" ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    <span className={isChecked ? "text-foreground font-bold" : "text-muted-foreground"}>
                      {st === "active" ? "Hoạt động (Active)" : "Đình chỉ (Inactive)"}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Action buttons with clear spacing */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="h-10 px-4 rounded-xl text-xs font-medium cursor-pointer border-border bg-secondary/30 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              className="h-10 px-5 gap-2 rounded-xl text-xs font-semibold cursor-pointer shadow-xs bg-primary hover:bg-primary/90 text-white transition-all"
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
