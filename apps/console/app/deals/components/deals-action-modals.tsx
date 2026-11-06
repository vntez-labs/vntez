"use client";

import React from "react";
import { CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useDealsStore } from "../deals-store";

export function DealsActionModals() {
  const {
    approvingRequest,
    setApprovingRequest,
    adminNotesInput,
    setAdminNotesInput,
    handleApproveConfirm,

    decliningRequest,
    setDecliningRequest,
    declineReasonInput,
    setDeclineReasonInput,
    handleDeclineConfirm,

    deletingRequest,
    setDeletingRequest,
    handleDeleteConfirm,

    isSubmitting,
  } = useDealsStore();

  return (
    <>
      {/* ================= MODAL: PHÊ DUYỆT DEAL (APPROVE) ================= */}
      {approvingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border-0 bg-white dark:bg-card p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground font-display">
                  Phê duyệt Deal & Cấp phát Client ID
                </h3>
                <p className="text-xs text-muted-foreground">
                  Dự án: <span className="font-semibold text-foreground">{approvingRequest.project_name}</span>
                </p>
              </div>
            </div>

            <div className="border-l-2 border-emerald-500 pl-3.5 py-1 text-xs text-foreground space-y-1">
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">Hệ thống sẽ thực hiện:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-muted-foreground">
                <li>Tự động sinh mã Client ID bảo mật dạng <code className="font-mono font-semibold text-foreground">vntez_&lt;hex&gt;</code></li>
                <li>Ghi thẳng vào bảng Supabase <code className="font-mono font-semibold text-foreground">public.oauth_clients</code></li>
                <li>Mở khóa cổng truy cập Console ngay lập tức</li>
              </ul>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Ghi chú phê duyệt (Tùy chọn)
              </label>
              <textarea
                rows={3}
                spellCheck={false}
                value={adminNotesInput}
                onChange={(e) => setAdminNotesInput(e.target.value)}
                placeholder="Ghi chú lưu nội bộ hoặc hướng dẫn thêm cho đối tác..."
                className="w-full rounded-xl border-0 bg-[#f7f5ef] dark:bg-[#141b2b] p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f5f2eb] dark:border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setApprovingRequest(null)}
                disabled={isSubmitting}
                className="rounded-xl border-0 bg-[#f5f2eb] dark:bg-muted text-xs h-9 cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                size="sm"
                onClick={handleApproveConfirm}
                disabled={isSubmitting}
                className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs h-9 font-medium shadow-xs cursor-pointer"
              >
                {isSubmitting ? "Đang tạo Client ID..." : "Xác nhận Phê duyệt"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: TỪ CHỐI DEAL (DECLINE) ================= */}
      {decliningRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border-0 bg-white dark:bg-card p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground font-display">
                  Từ chối Hồ sơ Deal Đối tác
                </h3>
                <p className="text-xs text-muted-foreground">
                  Dự án: <span className="font-semibold text-foreground">{decliningRequest.project_name}</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Lý do từ chối thẩm định <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                spellCheck={false}
                value={declineReasonInput}
                onChange={(e) => setDeclineReasonInput(e.target.value)}
                placeholder="VD: Thông tin chứng minh pháp nhân chưa rõ ràng, cần bổ sung giấy phép kinh doanh..."
                className="w-full rounded-xl border-0 bg-[#f7f5ef] dark:bg-[#141b2b] p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-rose-500"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Lý do này sẽ hiển thị cho đối tác để họ có thể cập nhật và nộp lại đề xuất.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f5f2eb] dark:border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDecliningRequest(null)}
                disabled={isSubmitting}
                className="rounded-xl border-0 bg-[#f5f2eb] dark:bg-muted text-xs h-9 cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                size="sm"
                onClick={handleDeclineConfirm}
                disabled={isSubmitting}
                className="rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-xs h-9 font-medium shadow-xs cursor-pointer"
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận Từ chối"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: XÓA DEAL ================= */}
      {deletingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border-0 bg-white dark:bg-card p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground font-display">
                  Xác nhận Xóa Hồ sơ Deal
                </h3>
                <p className="text-xs text-muted-foreground">
                  Hành động này không thể hoàn tác
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Bạn có chắc chắn muốn xóa hồ sơ Deal của dự án{" "}
              <strong className="text-foreground">{deletingRequest.project_name}</strong>{" "}
              (Người đại diện: {deletingRequest.applicant_name})?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f5f2eb] dark:border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingRequest(null)}
                disabled={isSubmitting}
                className="rounded-xl border-0 bg-[#f5f2eb] dark:bg-muted text-xs h-9 cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                size="sm"
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
                className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs h-9 font-medium shadow-xs cursor-pointer"
              >
                {isSubmitting ? "Đang xóa..." : "Xóa Hồ sơ"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
