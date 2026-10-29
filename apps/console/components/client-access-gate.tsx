"use client";

import React, { useState } from "react";
import { useAuthStore } from "@workspace/auth/store";
import { fixVietnameseEncoding } from "@workspace/auth/encoding";
import { Button } from "@workspace/ui/components/button";
import {
  ShieldAlert,
  Clock,
  Send,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Terminal,
  LogOut,
  FileText,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import type { ClientRequestRecord } from "@/lib/client-requests";

interface ClientAccessGateProps {
  pendingRequests: ClientRequestRecord[];
  rejectedRequests: ClientRequestRecord[];
  onRefresh: () => void;
}

export function ClientAccessPendingGate({
  pendingRequests,
  rejectedRequests,
  onRefresh,
}: ClientAccessGateProps) {
  const { user, logout } = useAuthStore();
  const displayName = fixVietnameseEncoding(user?.name) || "Đối tác";

  const [formData, setFormData] = useState({
    project_name: "",
    project_idea: "",
    identity_proof: "",
    applicant_phone: "",
    requested_redirect_uris: "http://localhost:3000/auth/callback",
    project_website: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/client-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          applicant_name: displayName,
          applicant_email: user?.email,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể nộp đề xuất");
      }

      setSuccessMessage(
        "Hồ sơ đề xuất ứng dụng của bạn đã được gửi thành công! Ban quản trị VNTEZ sẽ thẩm định và cấp phát Client ID cho bạn sớm nhất."
      );
      setFormData({
        project_name: "",
        project_idea: "",
        identity_proof: "",
        applicant_phone: "",
        requested_redirect_uris: "http://localhost:3000/auth/callback",
        project_website: "",
      });
      onRefresh();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#080c14] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-primary">
              Partner Hub
            </span>
            <h2 className="text-sm font-bold font-display tracking-tight text-foreground">
              VNTEZ CONSOLE
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="text-xs border-0 bg-white dark:bg-card shadow-xs cursor-pointer gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Kiểm tra trạng thái
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            className="text-xs border-0 bg-white dark:bg-card shadow-xs text-destructive hover:bg-destructive/10 cursor-pointer gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            Đăng xuất
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full space-y-6 flex-1">
        {/* Welcome & Access Alert Banner */}
        <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold font-display text-foreground">
                Xin chào, {displayName}!
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tài khoản <code className="font-mono text-foreground font-semibold">{user?.email}</code> chưa có Ứng dụng OAuth nào được kích hoạt.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8f6f0] dark:bg-muted/30 text-xs text-muted-foreground leading-relaxed">
            Hệ thống Console yêu cầu đối tác phải có ít nhất <strong>01 OAuth Client</strong> được Ban quản trị thẩm định và phê duyệt trước khi được mở khóa quyền quản trị. Vui lòng gửi hồ sơ đề xuất dự án bên dưới để chúng tôi xét duyệt deal hợp tác.
          </div>
        </div>

        {/* Existing Applications Status (If any) */}
        {(pendingRequests.length > 0 || rejectedRequests.length > 0) && (
          <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Hồ sơ Đề xuất đã gửi của bạn ({pendingRequests.length + rejectedRequests.length})
            </h3>

            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-amber-500/5 border-0 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm font-display">
                      {req.project_name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 font-semibold text-[11px] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Đang chờ Ban quản trị duyệt
                    </span>
                  </div>
                  <p className="text-muted-foreground">{req.project_idea}</p>
                  <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-3 pt-1">
                    <span>Nộp lúc: {new Date(req.created_at).toLocaleString("vi-VN")}</span>
                    <span>•</span>
                    <span>Redirect URIs: {req.requested_redirect_uris.join(", ")}</span>
                  </div>
                </div>
              ))}

              {rejectedRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-destructive/5 border-0 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm font-display">
                      {req.project_name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold text-[11px] flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      Chưa đạt yêu cầu
                    </span>
                  </div>
                  <p className="text-muted-foreground">{req.project_idea}</p>
                  {req.admin_notes && (
                    <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs">
                      <strong>Phản hồi từ Admin:</strong> {req.admin_notes}
                    </div>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    Bạn có thể hoàn thiện thông tin và nộp lại đề xuất mới bên dưới.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application Submission Form */}
        <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Nộp Hồ sơ Đề xuất Dự án & Đăng ký OAuth Client
            </h3>
            <p className="text-xs text-muted-foreground">
              Cung cấp thông tin dự án, chứng minh danh tính đại diện và các endpoint callback cần cấp phép
            </p>
          </div>

          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-xs flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Tên dự án / Ứng dụng <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  spellCheck={false}
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  placeholder="Ví dụ: VNTEZ Fintech, E-commerce Hub..."
                  className="w-full h-9 px-3 bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Website dự án <span className="text-muted-foreground font-normal">(Tùy chọn)</span>
                </label>
                <input
                  type="url"
                  spellCheck={false}
                  value={formData.project_website}
                  onChange={(e) => setFormData({ ...formData, project_website: e.target.value })}
                  placeholder="https://my-project.com (nếu có)"
                  className="w-full h-9 px-3 bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Ý tưởng dự án & Mô tả giá trị hợp tác <span className="text-destructive">*</span>
              </label>
              <textarea
                required
                rows={3}
                spellCheck={false}
                value={formData.project_idea}
                onChange={(e) => setFormData({ ...formData, project_idea: e.target.value })}
                placeholder="Mô tả tóm tắt giải pháp, tập khách hàng mục tiêu và mục đích tích hợp Single Sign-On VNTEZ ID..."
                className="w-full p-3 text-xs bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Chứng minh danh tính / Giấy tờ ủy quyền
                </label>
                <input
                  type="text"
                  spellCheck={false}
                  value={formData.identity_proof}
                  onChange={(e) => setFormData({ ...formData, identity_proof: e.target.value })}
                  placeholder="Số CCCD / MST Doanh nghiệp / Giấy ĐKKD..."
                  className="w-full h-9 px-3 bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Số điện thoại liên hệ</label>
                <input
                  type="tel"
                  spellCheck={false}
                  value={formData.applicant_phone}
                  onChange={(e) => setFormData({ ...formData, applicant_phone: e.target.value })}
                  placeholder="+84 901 234 567"
                  className="w-full h-9 px-3 bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Redirect URIs (Mỗi dòng một URI) <span className="text-destructive">*</span>
              </label>
              <textarea
                required
                rows={2}
                spellCheck={false}
                value={formData.requested_redirect_uris}
                onChange={(e) =>
                  setFormData({ ...formData, requested_redirect_uris: e.target.value })
                }
                placeholder="http://localhost:3000/auth/callback&#10;https://my-app.com/auth/callback"
                className="w-full p-3 font-mono text-xs bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2 text-xs h-9.5 px-5 font-semibold"
              >
                <Send className="h-3.5 w-3.5" />
                {isSubmitting ? "Đang gửi hồ sơ..." : "Gửi Hồ sơ Đề xuất Xét duyệt"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-muted-foreground/60 font-mono py-4">
        VNTEZ Identity Ecosystem &copy; 2026. Partner Approval Gateway.
      </footer>
    </div>
  );
}
