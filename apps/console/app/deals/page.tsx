"use client";

import React, { useEffect, useState } from "react";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { Button } from "@workspace/ui/components/button";
import {
  Handshake,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Edit,
  Trash2,
  Eye,
  ShieldCheck,
  Building,
  User,
  Sparkles,
  X,
  Globe,
  Phone,
  Mail,
  FileCheck2,
} from "lucide-react";
import type { ClientRequestRecord } from "@/lib/client-requests";

export default function DealsPage() {
  return (
    <AuthGuard>
      <ConsoleShell>
        <DealsContent />
      </ConsoleShell>
    </AuthGuard>
  );
}

function DealsContent() {
  const [requests, setRequests] = useState<ClientRequestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [dealTypeFilter, setDealTypeFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals state
  const [viewingRequest, setViewingRequest] = useState<ClientRequestRecord | null>(null);
  const [approvingRequest, setApprovingRequest] = useState<ClientRequestRecord | null>(null);
  const [decliningRequest, setDecliningRequest] = useState<ClientRequestRecord | null>(null);
  const [editingRequest, setEditingRequest] = useState<ClientRequestRecord | null>(null);
  const [deletingRequest, setDeletingRequest] = useState<ClientRequestRecord | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [declineReasonInput, setDeclineReasonInput] = useState("");

  const [formData, setFormData] = useState({
    project_name: "",
    deal_type: "enterprise" as "partner" | "enterprise" | "startup" | "individual",
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
    identity_proof: "",
    project_idea: "",
    project_website: "",
    requested_redirect_uris: "http://localhost:3000/auth/callback",
    admin_notes: "",
    auto_approve: true,
  });

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/client-requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to fetch client requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Create Modal (Admin Bypass: siêu tinh gọn)
  const openCreateModal = () => {
    setFormData({
      project_name: "",
      deal_type: "enterprise",
      applicant_name: "",
      applicant_email: "",
      applicant_phone: "",
      identity_proof: "",
      project_idea: "",
      project_website: "",
      requested_redirect_uris: "http://localhost:3000/auth/callback",
      admin_notes: "",
      auto_approve: true,
    });
    setFormError(null);
    setIsCreateOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (req: ClientRequestRecord) => {
    setEditingRequest(req);
    setFormData({
      project_name: req.project_name,
      deal_type: req.deal_type,
      applicant_name: req.applicant_name,
      applicant_email: req.applicant_email,
      applicant_phone: req.applicant_phone || "",
      identity_proof: req.identity_proof || "",
      project_idea: req.project_idea,
      project_website: req.project_website || "",
      requested_redirect_uris: req.requested_redirect_uris.join("\n"),
      admin_notes: req.admin_notes || "",
      auto_approve: false,
    });
    setFormError(null);
  };

  // Submit Create Deal (Admin Bypass)
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const uris = formData.requested_redirect_uris
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean);

      const res = await fetch("/api/client-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: formData.project_name.trim(),
          project_website: formData.project_website.trim() || null,
          requested_redirect_uris: uris,
          auto_approve: formData.auto_approve,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể tạo ứng dụng");
      }

      setIsCreateOpen(false);
      await fetchRequests();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Edit Deal
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRequest) return;
    setFormError(null);
    setIsSubmitting(true);

    try {
      const uris = formData.requested_redirect_uris
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean);

      const res = await fetch("/api/client-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingRequest.id,
          project_name: formData.project_name,
          deal_type: formData.deal_type,
          applicant_name: formData.applicant_name,
          applicant_email: formData.applicant_email,
          applicant_phone: formData.applicant_phone || null,
          identity_proof: formData.identity_proof || null,
          project_idea: formData.project_idea,
          project_website: formData.project_website || null,
          requested_redirect_uris: uris,
          admin_notes: formData.admin_notes || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể cập nhật hồ sơ");
      }

      setEditingRequest(null);
      await fetchRequests();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Delete Deal
  const handleDeleteConfirm = async () => {
    if (!deletingRequest) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/client-requests?id=${encodeURIComponent(deletingRequest.id)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể xóa hồ sơ Deal");
      }

      setDeletingRequest(null);
      await fetchRequests();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Approve Deal (Auto-creates OAuth Client in Supabase)
  const handleApproveConfirm = async () => {
    if (!approvingRequest) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/client-requests/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: approvingRequest.id,
          admin_notes: adminNotesInput.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể phê duyệt Deal đối tác");
      }

      setApprovingRequest(null);
      setAdminNotesInput("");
      await fetchRequests();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Decline Deal
  const handleDeclineConfirm = async () => {
    if (!decliningRequest) return;
    if (!declineReasonInput.trim()) {
      alert("Vui lòng nhập lý do từ chối để đối tác có thông tin hoàn thiện hồ sơ.");
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/client-requests/decline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: decliningRequest.id,
          reason: declineReasonInput.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể từ chối hồ sơ Deal");
      }

      setDecliningRequest(null);
      setDeclineReasonInput("");
      await fetchRequests();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    // Status filter
    if (statusFilter !== "all" && r.status !== statusFilter) return false;

    // Deal type filter
    if (dealTypeFilter !== "all" && r.deal_type !== dealTypeFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchProject = r.project_name.toLowerCase().includes(query);
      const matchName = r.applicant_name.toLowerCase().includes(query);
      const matchEmail = r.applicant_email.toLowerCase().includes(query);
      const matchPhone = r.applicant_phone?.toLowerCase().includes(query);
      const matchIdea = r.project_idea.toLowerCase().includes(query);
      const matchIdProof = r.identity_proof?.toLowerCase().includes(query);
      const matchClientId = r.approved_client_id?.toLowerCase().includes(query);

      return (
        matchProject ||
        matchName ||
        matchEmail ||
        matchPhone ||
        matchIdea ||
        matchIdProof ||
        matchClientId
      );
    }

    return true;
  });

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const getDealTypeBadge = (type: string) => {
    switch (type) {
      case "enterprise":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
            <Building className="h-2.5 w-2.5" />
            Doanh nghiệp
          </span>
        );
      case "partner":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
            <Handshake className="h-2.5 w-2.5" />
            Đối tác chiến lược
          </span>
        );
      case "startup":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
            <Sparkles className="h-2.5 w-2.5" />
            Startup
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[10px] font-medium text-stone-600 dark:text-stone-300">
            <User className="h-2.5 w-2.5" />
            Cá nhân
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Đã duyệt & Cấp Client
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
            <XCircle className="h-3.5 w-3.5" />
            Từ chối Deal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300 animate-pulse">
            <Clock className="h-3.5 w-3.5" />
            Chờ thẩm định
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-display">
              Xét duyệt & Thẩm định Deal Đối tác
            </h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary font-mono">
              OAuth Gatekeeper
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Đánh giá thông tin người tạo, chứng minh pháp nhân và ý tưởng dự án. Phê duyệt (Approve) sẽ tự động tạo OAuth Client trong Supabase và mở cổng truy cập.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRequests}
            disabled={isLoading}
            className="rounded-xl border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:bg-[#f5f2eb] text-xs h-9 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

          <Button
            size="sm"
            onClick={openCreateModal}
            className="rounded-xl bg-primary text-white shadow-xs hover:bg-primary/90 text-xs h-9 font-medium cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Tạo Deal / Yêu cầu mới
          </Button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border-0 bg-white dark:bg-card p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Tổng số Deal
          </span>
          <p className="text-2xl font-bold font-display text-foreground mt-1">
            {counts.all}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5 block">
            Hồ sơ đối tác đã gửi
          </span>
        </div>

        <div className="rounded-2xl border-0 bg-white dark:bg-card p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Chờ thẩm định
          </span>
          <p className="text-2xl font-bold font-display text-amber-600 dark:text-amber-400 mt-1">
            {counts.pending}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5 block">
            Cần admin phê duyệt
          </span>
        </div>

        <div className="rounded-2xl border-0 bg-white dark:bg-card p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3" />
            Đã chấp thuận
          </span>
          <p className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400 mt-1">
            {counts.approved}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5 block">
            Đã cấp OAuth Client ID
          </span>
        </div>

        <div className="rounded-2xl border-0 bg-white dark:bg-card p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <XCircle className="h-3 w-3" />
            Đã từ chối
          </span>
          <p className="text-2xl font-bold font-display text-rose-600 dark:text-rose-400 mt-1">
            {counts.rejected}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5 block">
            Không đạt tiêu chuẩn
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border-0 bg-white dark:bg-card p-3 shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-0 ${
              statusFilter === "all"
                ? "bg-primary text-white"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Tất cả ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-0 flex items-center gap-1.5 ${
              statusFilter === "pending"
                ? "bg-amber-500 text-white"
                : "bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20"
            }`}
          >
            <Clock className="h-3 w-3" />
            Chờ thẩm định ({counts.pending})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("approved")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-0 flex items-center gap-1.5 ${
              statusFilter === "approved"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            Đã duyệt ({counts.approved})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("rejected")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-0 flex items-center gap-1.5 ${
              statusFilter === "rejected"
                ? "bg-rose-600 text-white"
                : "bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20"
            }`}
          >
            <XCircle className="h-3 w-3" />
            Từ chối ({counts.rejected})
          </button>
        </div>

        {/* Right Search & Deal Type Selector */}
        <div className="flex items-center gap-2">
          <select
            value={dealTypeFilter}
            onChange={(e) => setDealTypeFilter(e.target.value)}
            className="rounded-xl border-0 bg-[#f7f5ef] dark:bg-[#141b2b] px-3 py-1.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">Mọi loại hình Deal</option>
            <option value="partner">Đối tác chiến lược</option>
            <option value="enterprise">Doanh nghiệp</option>
            <option value="startup">Startup</option>
            <option value="individual">Cá nhân</option>
          </select>

          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              spellCheck={false}
              autoComplete="off"
              placeholder="Tìm dự án, đối tác, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-0 bg-[#f7f5ef] dark:bg-[#141b2b] pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#f5f2eb] dark:border-border/60 bg-[#fcfbfa] dark:bg-muted/20">
                <th className="py-3.5 pl-6 pr-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  Dự án & Đối tác
                </th>
                <th className="py-3.5 px-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  Người đại diện / Liên hệ
                </th>
                <th className="py-3.5 px-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  Pháp nhân / Chứng minh
                </th>
                <th className="py-3.5 px-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  Ý tưởng & Redirects
                </th>
                <th className="py-3.5 px-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  Trạng thái Thẩm định
                </th>
                <th className="py-3.5 pl-4 pr-6 text-right font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f7f5ef] dark:divide-border/40">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                      <span>Đang tải danh sách hồ sơ Deal đối tác...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Handshake className="h-8 w-8 text-muted-foreground/40" />
                      <p className="font-medium text-foreground">Chưa có Deal đối tác nào</p>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        {searchQuery
                          ? "Không có hồ sơ nào khớp với từ khóa tìm kiếm của bạn."
                          : "Hiện tại chưa có hồ sơ đăng ký đối tác nào trong cơ sở dữ liệu Supabase."}
                      </p>
                      <Button
                        size="sm"
                        onClick={openCreateModal}
                        className="mt-2 rounded-xl bg-primary text-white text-xs h-8"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Tạo Deal mới
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-[#faf8f3] dark:hover:bg-muted/30 transition-colors"
                  >
                    {/* Project & Deal Type */}
                    <td className="py-3.5 pl-6 pr-4 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground text-sm">
                            {req.project_name}
                          </span>
                          {getDealTypeBadge(req.deal_type)}
                        </div>
                        {req.project_website && (
                          <a
                            href={req.project_website}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-mono"
                          >
                            <Globe className="h-3 w-3" />
                            <span>{req.project_website.replace(/^https?:\/\//, "")}</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Applicant Info */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{req.applicant_name}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[170px]">{req.applicant_email}</span>
                        </div>
                        {req.applicant_phone && (
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                            <Phone className="h-3 w-3 shrink-0" />
                            <span>{req.applicant_phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Identity Proof */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="max-w-[200px]">
                        {req.identity_proof ? (
                          <div className="flex items-start gap-1.5">
                            <FileCheck2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-[11px] text-foreground font-medium line-clamp-2">
                              {req.identity_proof}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/40 font-mono">—</span>
                        )}
                      </div>
                    </td>

                    {/* Project Idea & Redirects */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="max-w-[260px] space-y-1">
                        {req.project_idea &&
                          !req.project_idea.startsWith("Ứng dụng ") && (
                            <p className="text-[11px] text-muted-foreground line-clamp-1 mb-1">
                              {req.project_idea}
                            </p>
                          )}
                        <div className="flex flex-wrap items-center gap-1 font-mono text-[10px]">
                          {req.requested_redirect_uris.slice(0, 2).map((uri, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-[#f6f4ee] dark:bg-stone-800 text-stone-700 dark:text-stone-300 truncate max-w-[210px] inline-block font-mono"
                              title={uri}
                            >
                              {uri.replace(/^https?:\/\//, "")}
                            </span>
                          ))}
                          {req.requested_redirect_uris.length > 2 && (
                            <span className="text-muted-foreground text-[10px]">
                              +{req.requested_redirect_uris.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status & Client ID */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-1.5">
                        <div>{getStatusBadge(req.status)}</div>

                        {/* Approved Client ID */}
                        {req.status === "approved" && req.approved_client_id && (
                          <div className="flex items-center gap-1.5 bg-emerald-500/10 rounded-lg px-2 py-1 max-w-[210px]">
                            <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="font-mono text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 truncate">
                              {req.approved_client_id}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(req.approved_client_id!, `cid_${req.id}`)}
                              className="text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer ml-auto"
                              title="Sao chép Client ID"
                            >
                              {copiedId === `cid_${req.id}` ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        )}

                        {/* Rejection Note */}
                        {req.status === "rejected" && req.admin_notes && (
                          <p className="text-[10px] text-rose-600 dark:text-rose-400 line-clamp-2 max-w-[200px]">
                            Lý do: {req.admin_notes}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pl-4 pr-6 align-top text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* If Pending: Show Quick Approve & Decline buttons */}
                        {req.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setApprovingRequest(req);
                                setAdminNotesInput(
                                  `Hồ sơ dự án ${req.project_name} đạt chuẩn thẩm định đối tác. Đã phê duyệt cấp Client ID.`
                                );
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                              title="Phê duyệt Deal & Cấp Client ID"
                            >
                              <Check className="h-3 w-3" />
                              <span>Duyệt</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setDecliningRequest(req);
                                setDeclineReasonInput("");
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
                              title="Từ chối Deal"
                            >
                              <X className="h-3 w-3" />
                              <span>Từ chối</span>
                            </button>
                          </>
                        )}

                        {/* View Full Dossier */}
                        <button
                          type="button"
                          onClick={() => setViewingRequest(req)}
                          className="p-1.5 rounded-lg hover:bg-[#f6f3eb] dark:hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          title="Xem toàn bộ hồ sơ"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Edit Request */}
                        <button
                          type="button"
                          onClick={() => openEditModal(req)}
                          className="p-1.5 rounded-lg hover:bg-[#f6f3eb] dark:hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          title="Chỉnh sửa thông tin"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        {/* Delete Request */}
                        <button
                          type="button"
                          onClick={() => setDeletingRequest(req)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                          title="Xóa hồ sơ Deal"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: XEM CHI TIẾT HỒ SƠ DEAL ================= */}
      {viewingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl border-0 bg-white dark:bg-card p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] max-h-[90vh] overflow-y-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#f5f2eb] dark:border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Handshake className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground font-display">
                    Chi tiết Hồ sơ Deal
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Mã hồ sơ: {viewingRequest.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingRequest(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-[#f5f2eb] hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Clean Details Body without murky nested background boxes */}
            <div className="divide-y divide-[#f5f2eb] dark:divide-border/60 text-xs">
              {/* Row 1: Tên dự án & Hình thức */}
              <div className="py-3.5 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                    Tên dự án / Ứng dụng
                  </span>
                  <p className="font-bold text-foreground text-sm mt-0.5">{viewingRequest.project_name}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                    Hình thức Hợp tác
                  </span>
                  <div className="mt-0.5">{getDealTypeBadge(viewingRequest.deal_type)}</div>
                </div>
                {viewingRequest.project_website && (
                  <div className="col-span-2 pt-1">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                      Website dự án
                    </span>
                    <a
                      href={viewingRequest.project_website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-primary mt-0.5 inline-flex items-center gap-1 hover:underline text-xs"
                    >
                      <span>{viewingRequest.project_website}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Row 2: Người đại diện & Pháp nhân */}
              <div className="py-3.5 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                    Người đại diện
                  </span>
                  <p className="font-semibold text-foreground mt-0.5">{viewingRequest.applicant_name}</p>
                  <p className="font-mono text-muted-foreground text-[11px] mt-0.5">{viewingRequest.applicant_email}</p>
                  {viewingRequest.applicant_phone && (
                    <p className="font-mono text-muted-foreground text-[11px]">{viewingRequest.applicant_phone}</p>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                    Chứng minh pháp nhân
                  </span>
                  <p className="font-medium text-foreground mt-0.5">
                    {viewingRequest.identity_proof || "—"}
                  </p>
                </div>
              </div>

              {/* Row 3: Ý tưởng & Giải pháp (chỉ hiển thị nếu đối tác tự nhập) */}
              {viewingRequest.project_idea && !viewingRequest.project_idea.startsWith("Ứng dụng ") && (
                <div className="py-3.5 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                    Ý tưởng & Giải pháp tích hợp
                  </span>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap mt-1">
                    {viewingRequest.project_idea}
                  </p>
                </div>
              )}

              {/* Row 4: Callback / Redirect URIs */}
              <div className="py-3.5 space-y-2">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                  Redirect URIs ({viewingRequest.requested_redirect_uris.length})
                </span>
                <div className="space-y-1 mt-1">
                  {viewingRequest.requested_redirect_uris.map((uri, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between font-mono text-xs text-foreground bg-[#f8f6f0] dark:bg-muted/40 rounded-xl px-3 py-2"
                    >
                      <span className="truncate">{uri}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(uri, `uri_${idx}`)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0 ml-2"
                      >
                        {copiedId === `uri_${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 5: Trạng thái & Client ID */}
              <div className="py-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Trạng thái thẩm định
                  </span>
                  <div>{getStatusBadge(viewingRequest.status)}</div>
                </div>

                {viewingRequest.approved_client_id && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                      Client ID đã cấp phát
                    </span>
                    <div className="flex items-center justify-between mt-1 bg-emerald-500/10 p-2.5 rounded-xl font-mono text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
                      <span>{viewingRequest.approved_client_id}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(viewingRequest.approved_client_id!, "view_cid")}
                        className="cursor-pointer ml-auto text-emerald-700 hover:text-emerald-900"
                      >
                        {copiedId === "view_cid" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                {viewingRequest.admin_notes && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                      Ghi chú thẩm định
                    </span>
                    <p className="text-foreground mt-0.5">{viewingRequest.admin_notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f5f2eb] dark:border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingRequest(null)}
                className="rounded-xl border-0 bg-[#f5f2eb] dark:bg-muted text-xs h-9 cursor-pointer"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}

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
                onClick={() => setIsCreateOpen(false)}
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
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
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
                    setFormData({ ...formData, requested_redirect_uris: e.target.value })
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
                  onChange={(e) => setFormData({ ...formData, project_website: e.target.value })}
                  placeholder="https://app.example.com (nếu có)"
                  className="w-full rounded-xl border-0 bg-[#f7f5ef] dark:bg-[#141b2b] px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="auto_approve_check"
                  checked={formData.auto_approve}
                  onChange={(e) => setFormData({ ...formData, auto_approve: e.target.checked })}
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
                  onClick={() => setIsCreateOpen(false)}
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
                onClick={() => setEditingRequest(null)}
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
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
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
                    setFormData({ ...formData, requested_redirect_uris: e.target.value })
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
                  onChange={(e) => setFormData({ ...formData, project_website: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                  placeholder="Nhập ghi chú hoặc đánh giá đối tác..."
                  className="w-full rounded-xl border-0 bg-[#f7f5ef] dark:bg-[#141b2b] px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f5f2eb] dark:border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingRequest(null)}
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
    </div>
  );
}
