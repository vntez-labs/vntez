"use client";

import React, { useEffect } from "react";
import { UserPlus, X, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useUsersStore } from "../users-store";

export function UsersModals() {
  const {
    isAddUserOpen,
    closeAddUserModal,
    addFormData,
    setAddFormData,
    handleAddUserSubmit,
    deletingUser,
    setDeletingUser,
    handleDeleteUserSubmit,
    isSubmitting,
    formError,
  } = useUsersStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isAddUserOpen) closeAddUserModal();
        if (deletingUser) setDeletingUser(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAddUserOpen, deletingUser, closeAddUserModal, setDeletingUser]);

  return (
    <>
      {/* Modal: Thêm người dùng mới */}
      {isAddUserOpen && (
        <div
          onClick={closeAddUserModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-emerald-600" />
                Thêm người dùng mới
              </h3>
              <button
                type="button"
                onClick={closeAddUserModal}
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

            <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Email đăng nhập <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  required
                  spellCheck={false}
                  value={addFormData.email}
                  onChange={(e) => setAddFormData({ email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full h-9 px-3 bg-muted/50 border border-input rounded-xl outline-none focus:ring-1 focus:ring-ring text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Mật khẩu khởi tạo <span className="text-destructive">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={addFormData.password}
                  onChange={(e) => setAddFormData({ password: e.target.value })}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full h-9 px-3 bg-muted/50 border border-input rounded-xl outline-none focus:ring-1 focus:ring-ring text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Tên hiển thị (Họ và tên)
                </label>
                <input
                  type="text"
                  spellCheck={false}
                  value={addFormData.full_name}
                  onChange={(e) => setAddFormData({ full_name: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full h-9 px-3 bg-muted/50 border border-input rounded-xl outline-none focus:ring-1 focus:ring-ring text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Số điện thoại (Tùy chọn)
                </label>
                <input
                  type="tel"
                  spellCheck={false}
                  value={addFormData.phone}
                  onChange={(e) => setAddFormData({ phone: e.target.value })}
                  placeholder="+84 901 234 567"
                  className="w-full h-9 px-3 bg-muted/50 border border-input rounded-xl outline-none focus:ring-1 focus:ring-ring text-foreground"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeAddUserModal}
                  className="text-xs h-9 cursor-pointer"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-xs h-9 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  {isSubmitting ? "Đang tạo..." : "Xác nhận Tạo người dùng"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Xác nhận Xóa người dùng */}
      {deletingUser && (
        <div
          onClick={() => setDeletingUser(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-destructive/10 text-destructive">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Xác nhận xóa Người dùng
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tài khoản này sẽ bị xóa hoàn toàn khỏi hệ thống.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-destructive/5 text-xs text-destructive space-y-1">
              <div>
                Người dùng: <strong>{deletingUser.name}</strong>
              </div>
              <div>Email: {deletingUser.email}</div>
              <div className="font-mono text-[11px] truncate">
                UID: {deletingUser.id}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingUser(null)}
                className="text-xs h-9 cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isSubmitting}
                onClick={handleDeleteUserSubmit}
                className="text-xs h-9 font-semibold cursor-pointer"
              >
                {isSubmitting ? "Đang xóa..." : "Xác nhận Xóa vĩnh viễn"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
