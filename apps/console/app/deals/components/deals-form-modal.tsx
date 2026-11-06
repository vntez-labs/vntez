"use client";

import React from "react";
import { X, Edit } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useDealsStore } from "../deals-store";

export function DealsFormModal() {
  const {
    isCreateOpen,
    closeCreateModal,
    editingRequest,
    closeEditModal,
    formData,
    updateFormData,
    handleCreateSubmit,
    handleEditSubmit,
    isSubmitting,
    formError,
  } = useDealsStore();

  return (
    <>
      {/* ================= MODAL: TẠO ỨNG DỤNG MỚI (ADMIN BYPASS) ================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border-0 bg-white dark:bg-card p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] space-y-5">
            <div className="flex items-start justify-between border-b border-[#f5f2eb] dark:border-border/60 pb-3">
              <div>
                <h3 className="text-base font-semibold text-foreground font-display">
                  Tạo ứng dụng OAuth mới
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Đăng ký ứng dụng và cấp phát OAuth Client ID
                </p>
              </div>
              <button
                type="button"
                onClick={closeCreateModal}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-[#f5f2eb] hover:text-foreground cursor-pointer transition-colors -mr-1 -mt-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Tên dự án / Ứng dụng <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  spellCheck={false}
                  value={formData.project_name}
                  onChange={(e) => updateFormData({ project_name: e.target.value })}
                  placeholder="VD: VNTEZ Mobile App, Portal CMS, Analytics Hub..."
                  className="w-full rounded-xl border-0 bg-[#f7f5ef] dark:bg-[#141b2b] px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Redirect URIs (Mỗi URI một dòng) <span className="text-destructive">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  spellCheck={false}
                  value={formData.requested_redirect_uris}
                  onChange={(e) =>
                    updateFormData({ requested_redirect_uris: e.target.value })
                  }
                  placeholder="http://localhost:3000/auth/callback&#10;https://my-app.com/auth/callback"
                  className="w-full font-mono rounded-xl border-0 bg-[#f7f5ef] dark:bg-[#141b2b] p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  Callback URL chuyển hướng hợp lệ sau khi người dùng xác thực VNTEZ ID.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Website dự án <span className="text-muted-foreground font-normal">(Tùy chọn)</span>
                </label>
                <input
                  type="url"
                  spellCheck={false}
                  value={formData.project_website}
                  onChange={(e) => updateFormData({ project_website: e.target.value })}
                  placeholder="https://app.example.com (nếu có)"
                  className="w-full rounded-xl border-0 bg-[#f7f5ef] dark:bg-[#141b2b] px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="auto_approve_check"
                  checked={formData.auto_approve}
                  onChange={(e) => updateFormData({ auto_approve: e.target.checked })}
                  className="h-4 w-4 rounded-sm accent-primary cursor-pointer"
                />
                <label htmlFor="auto_approve_check" className="cursor-pointer text-xs font-medium text-foreground">
                  Phê duyệt & kích hoạt Client ID ngay
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f5f2eb] dark:border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={closeCreateModal}
                  disabled={isSubmitting}
                  className="rounded-xl border-0 bg-[#f5f2eb] dark:bg-muted text-xs h-9 cursor-pointer"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="rounded-xl bg-primary text-white hover:bg-primary/90 text-xs h-9 font-medium shadow-xs cursor-pointer"
                >
                  {isSubmitting
                    ? "Đang khởi tạo..."
                    : formData.auto_approve
                    ? "Tạo & Cấp Client ID Ngay"
                    : "Tạo Hồ Sơ Chờ"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CHỈNH SỬA DEAL ================= */}
      {editingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border-0 bg-white dark:bg-card p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-[#f5f2eb] dark:border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Edit className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground font-display">
                    Chỉnh sửa Thông tin Deal
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Cập nhật ứng dụng: <span className="font-semibold text-foreground">{editingRequest.project_name}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-[#f5f2eb] hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Tên dự án / Ứng dụng <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  spellCheck={false}
                  value={formData.project_name}
                  onChange={(e) => updateFormData({ project_name: e.target.value })}
                  placeholder="VD: VNTEZ Business Manager"
                  className="w-full rounded-xl border-0 bg-[#f7f5ef] dark:bg-[#141b2b] px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Redirect URIs (Mỗi URI một dòng) <span className="text-destructive">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  spellCheck={false}
                  value={formData.requested_redirect_uris}
                  onChange={(e) =>
                    updateFormData({ requested_redirect_uris: e.target.value })
                  }
                  placeholder="http://localhost:3000/auth/callback&#10;https://app.doitac.com/auth/callback"
                  className="w-full font-mono rounded-xl border-0 bg-[#f7f5ef] dark:bg-[#141b2b] p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Website dự án <span className="text-muted-foreground font-normal">(Tùy chọn)</span>
                </label>
                <input
                  type="url"
                  spellCheck={false}
                  value={formData.project_website}
                  onChange={(e) => updateFormData({ project_website: e.target.value })}
                  placeholder="https://app.doitac.com (nếu có)"
                  className="w-full rounded-xl border-0 bg-[#f7f5ef] dark:bg-[#141b2b] px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Ghi chú thẩm định của Admin
                </label>
                <input
                  type="text"
                  spellCheck={false}
                  value={formData.admin_notes}
                  onChange={(e) => updateFormData({ admin_notes: e.target.value })}
                  placeholder="Nhập ghi chú hoặc đánh giá đối tác..."
                  className="w-full rounded-xl border-0 bg-[#f7f5ef] dark:bg-[#141b2b] px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f5f2eb] dark:border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={closeEditModal}
                  disabled={isSubmitting}
                  className="rounded-xl border-0 bg-[#f5f2eb] dark:bg-muted text-xs h-9 cursor-pointer"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="rounded-xl bg-primary text-white hover:bg-primary/90 text-xs h-9 font-medium shadow-xs cursor-pointer"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
