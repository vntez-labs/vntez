"use client";

import React, { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { FileText, Send, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@workspace/auth/store";
import { fixVietnameseEncoding } from "@workspace/auth/encoding";

interface PartnerProposalFormProps {
  onSuccess: () => void;
}

export function PartnerProposalForm({ onSuccess }: PartnerProposalFormProps) {
  const { user } = useAuthStore();
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
      onSuccess();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
}
