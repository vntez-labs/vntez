"use client";

import React, { useEffect, useState } from "react";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { Button } from "@workspace/ui/components/button";
import {
  ShieldCheck,
  Plus,
  RefreshCw,
  Search,
  Key,
  Copy,
  Check,
  Edit,
  Trash2,
  ExternalLink,
  Layers,
  Globe,
  Lock,
  AlertTriangle,
  X,
  Code,
} from "lucide-react";
import type { OAuthClientRecord } from "@/app/api/clients/route";

export default function ClientsPage() {
  return (
    <AuthGuard>
      <ConsoleShell>
        <ClientsContent />
      </ConsoleShell>
    </AuthGuard>
  );
}

function ClientsContent() {
  const [clients, setClients] = useState<OAuthClientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<OAuthClientRecord | null>(null);
  const [deletingClient, setDeletingClient] = useState<OAuthClientRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    client_id: "",
    description: "",
    redirect_uris: "",
    logo_url: "",
    is_internal: false,
  });

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
      }
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openCreateModal = () => {
    setFormData({
      name: "",
      client_id: "",
      description: "",
      redirect_uris: "http://localhost:3000/auth/callback",
      logo_url: "",
      is_internal: false,
    });
    setFormError(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (client: OAuthClientRecord) => {
    setEditingClient(client);
    setFormData({
      name: client.name || "",
      client_id: client.client_id,
      description: client.description || "",
      redirect_uris: client.redirect_uris.join("\n"),
      logo_url: client.logo_url || "",
      is_internal: client.is_internal,
    });
    setFormError(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể tạo client");
      }

      setIsCreateOpen(false);
      await fetchClients();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: editingClient.client_id,
          name: formData.name,
          description: formData.description,
          redirect_uris: formData.redirect_uris,
          logo_url: formData.logo_url,
          is_internal: formData.is_internal,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể cập nhật client");
      }

      setEditingClient(null);
      await fetchClients();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deletingClient) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/clients?clientId=${encodeURIComponent(deletingClient.client_id)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể xóa client");
      }

      setDeletingClient(null);
      await fetchClients();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Đã xảy ra lỗi khi xóa client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredClients = clients.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.client_id.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      c.redirect_uris.some((u) => u.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Quản lý Client OAuth 2.0 (public.oauth_clients)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Cấp quyền, tạo mới, chỉnh sửa và thu hồi các ứng dụng kết nối SSO qua giao thức chuẩn PKCE S256
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchClients}
            disabled={isLoading}
            className="gap-1.5 text-xs border-0 bg-white dark:bg-card shadow-xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

          <Button
            size="sm"
            onClick={openCreateModal}
            className="gap-1.5 text-xs border-0 shadow-xs cursor-pointer font-semibold"
          >
            <Plus className="h-4 w-4" />
            Tạo Client mới
          </Button>
        </div>
      </div>

      {/* Summary Cards - Borderless */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl p-5 space-y-1.5">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>Ứng dụng đã Đăng ký</span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-display text-foreground">
            {clients.length} Client
          </div>
          <p className="text-xs text-muted-foreground">
            Hạn mức hệ thống: {clients.length}/10 slots ({Math.round((clients.length / 10) * 100)}%)
          </p>
        </div>

        <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl p-5 space-y-1.5">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>Ứng dụng Nội bộ</span>
            <Lock className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-display text-foreground">
            {clients.filter((c) => c.is_internal).length}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Xác thực nội bộ VNTEZ Ecosystem
          </p>
        </div>

        <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl p-5 space-y-1.5">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>Ứng dụng Công khai</span>
            <Globe className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold font-display text-foreground">
            {clients.filter((c) => !c.is_internal).length}
          </div>
          <p className="text-xs text-muted-foreground">
            Bảo vệ với OAuth 2.0 PKCE S256
          </p>
        </div>

        <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl p-5 space-y-1.5">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>Tổng Giao dịch Mã PKCE</span>
            <Code className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold font-display text-foreground">
            {clients.reduce((acc, c) => acc + (c.codes_count || 0), 0)} Mã
          </div>
          <p className="text-xs text-muted-foreground">
            Được ghi nhận tại public.oauth_codes
          </p>
        </div>
      </div>

      {/* Main Table Card - Borderless */}
      <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden w-full max-w-full">
        <div className="p-4 sm:p-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-base font-bold flex items-center gap-2 text-foreground">
                <span>Danh sách Client Đang hoạt động</span>
                <span className="border-0 bg-primary/10 text-primary text-xs font-mono font-medium px-2.5 py-0.5 rounded-full">
                  {clients.length} ứng dụng
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Quản lý Client ID và danh sách Redirect URIs được phép ủy quyền SSO
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                spellCheck={false}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên, client_id, uri..."
                className="w-full h-8.5 pl-8 pr-3 text-xs bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
        </div>

        <div className="p-0 w-full max-w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs text-muted-foreground">Đang tải danh sách Client từ Supabase...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-16 text-xs text-muted-foreground space-y-3">
              <ShieldCheck className="h-8 w-8 text-muted-foreground/30 mx-auto" />
              <p>Chưa có Client nào hoặc không tìm thấy kết quả phù hợp.</p>
              <Button size="sm" onClick={openCreateModal} className="text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Tạo Client đầu tiên
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-full overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[780px]">
                <thead className="bg-[#faf8f4] dark:bg-muted/40 text-[#6e6a61] dark:text-slate-300 font-mono uppercase text-xs tracking-wider">
                  <tr>
                    <th className="py-3 px-5">Tên Ứng dụng</th>
                    <th className="py-3 px-5">Client ID (VNTEZ)</th>
                    <th className="py-3 px-5">Redirect URIs</th>
                    <th className="py-3 px-5">Phân loại</th>
                    <th className="py-3 px-5">Mã đã cấp</th>
                    <th className="py-3 px-5">Ngày tạo</th>
                    <th className="py-3 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f2eb] dark:divide-border/30 text-sm">
                  {filteredClients.map((client) => (
                    <tr
                      key={client.client_id}
                      className="hover:bg-[#fbf9f5] dark:hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-semibold text-foreground">
                        <div className="flex items-center gap-2.5">
                          {client.logo_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={client.logo_url}
                              alt={client.name}
                              className="h-8 w-8 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                              {client.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-foreground font-display">
                              {client.name}
                            </div>
                            {client.description && (
                              <div className="text-xs text-muted-foreground truncate max-w-xs font-normal">
                                {client.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-5 font-mono text-xs">
                        <div className="flex items-center gap-1.5 text-foreground font-semibold">
                          <span className="truncate max-w-[160px]">{client.client_id}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(client.client_id, client.client_id)}
                            title="Sao chép Client ID"
                            className="p-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          >
                            {copiedId === client.client_id ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {client.redirect_uris.map((uri) => (
                            <span
                              key={uri}
                              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#f4f1ea] dark:bg-muted text-[#6e6a61] truncate max-w-[200px]"
                              title={uri}
                            >
                              {uri}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        {client.is_internal ? (
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                            Nội bộ
                          </span>
                        ) : (
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#f4f1ea] text-[#6e6a61]">
                            Công khai
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 font-mono text-xs">
                        <span className="font-semibold text-foreground">
                          {client.codes_count || 0}
                        </span>{" "}
                        mã
                      </td>

                      <td className="py-3.5 px-5 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(client.created_at).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(client)}
                            title="Chỉnh sửa Client"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#f4f1ea] dark:hover:bg-muted transition-colors cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingClient(client)}
                            title="Xóa Client"
                            className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Thêm mới Client */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="border-0 bg-white dark:bg-card shadow-2xl rounded-2xl w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#f5f2eb] dark:border-border/40">
              <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Tạo mới Client OAuth 2.0
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
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

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Tên ứng dụng <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  spellCheck={false}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: VNTEZ Mobile App, Portal, CMS..."
                  className="w-full h-9 px-3 bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Client ID (Để trống sẽ tự sinh mã bảo mật)
                </label>
                <input
                  type="text"
                  spellCheck={false}
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  placeholder="vntez_39d12110... (hoặc để trống)"
                  className="w-full h-9 px-3 font-mono bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Redirect URIs (Mỗi dòng một URI) <span className="text-destructive">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  spellCheck={false}
                  value={formData.redirect_uris}
                  onChange={(e) => setFormData({ ...formData, redirect_uris: e.target.value })}
                  placeholder="http://localhost:3000/auth/callback&#10;https://my-app.com/auth/callback"
                  className="w-full p-3 font-mono text-xs bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Mô tả ứng dụng</label>
                <input
                  type="text"
                  spellCheck={false}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ứng dụng quản trị nghiệp vụ doanh nghiệp..."
                  className="w-full h-9 px-3 bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Logo URL</label>
                <input
                  type="url"
                  spellCheck={false}
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full h-9 px-3 bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_internal"
                  checked={formData.is_internal}
                  onChange={(e) => setFormData({ ...formData, is_internal: e.target.checked })}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
                <label htmlFor="is_internal" className="text-xs text-foreground cursor-pointer font-medium">
                  Ứng dụng nội bộ hệ sinh thái VNTEZ (is_internal)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="border-0 bg-[#f7f5ef] hover:bg-[#efebe2] text-xs h-9"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-xs h-9 font-semibold"
                >
                  {isSubmitting ? "Đang lưu..." : "Xác nhận Tạo Client"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Chỉnh sửa Client */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="border-0 bg-white dark:bg-card shadow-2xl rounded-2xl w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#f5f2eb] dark:border-border/40">
              <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                <Edit className="h-4 w-4 text-primary" />
                Chỉnh sửa Client: {editingClient.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingClient(null)}
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

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Client ID (Không thể đổi)</label>
                <input
                  type="text"
                  disabled
                  value={editingClient.client_id}
                  className="w-full h-9 px-3 font-mono bg-muted/60 text-muted-foreground border-0 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Tên ứng dụng <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  spellCheck={false}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-9 px-3 bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Redirect URIs (Mỗi dòng một URI) <span className="text-destructive">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  spellCheck={false}
                  value={formData.redirect_uris}
                  onChange={(e) => setFormData({ ...formData, redirect_uris: e.target.value })}
                  className="w-full p-3 font-mono text-xs bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Mô tả ứng dụng</label>
                <input
                  type="text"
                  spellCheck={false}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-9 px-3 bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Logo URL</label>
                <input
                  type="url"
                  spellCheck={false}
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  className="w-full h-9 px-3 bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit_is_internal"
                  checked={formData.is_internal}
                  onChange={(e) => setFormData({ ...formData, is_internal: e.target.checked })}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
                <label htmlFor="edit_is_internal" className="text-xs text-foreground cursor-pointer font-medium">
                  Ứng dụng nội bộ hệ sinh thái VNTEZ (is_internal)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingClient(null)}
                  className="border-0 bg-[#f7f5ef] hover:bg-[#efebe2] text-xs h-9"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-xs h-9 font-semibold"
                >
                  {isSubmitting ? "Đang cập nhật..." : "Lưu thay đổi"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Xác nhận Xóa Client */}
      {deletingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="border-0 bg-white dark:bg-card shadow-2xl rounded-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-destructive/10 text-destructive">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Xác nhận xóa Client OAuth</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Bạn có chắc chắn muốn xóa client này khỏi hệ thống?
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-destructive/5 text-xs text-destructive space-y-1">
              <div>
                Client: <strong>{deletingClient.name}</strong>
              </div>
              <div className="font-mono text-[11px] truncate">
                ID: {deletingClient.client_id}
              </div>
              <p className="text-[11px] opacity-80 pt-1">
                Lưu ý: Mọi mã xác thực và phiên cấp token gắn với client này sẽ bị xóa đồng thời.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingClient(null)}
                className="border-0 bg-[#f7f5ef] hover:bg-[#efebe2] text-xs h-9"
              >
                Hủy bỏ
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isSubmitting}
                onClick={handleDeleteSubmit}
                className="text-xs h-9 font-semibold"
              >
                {isSubmitting ? "Đang xóa..." : "Xác nhận Xóa"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
