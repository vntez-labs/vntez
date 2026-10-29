"use client";

import React, { useEffect, useState } from "react";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { Button } from "@workspace/ui/components/button";
import {
  Users,
  RefreshCw,
  Search,
  Fingerprint,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  UserPlus,
  Trash2,
  ExternalLink,
  Phone,
  Calendar,
  Clock,
  Globe,
  X,
  Code,
  AlertTriangle,
  ChevronRight,
  Eye,
} from "lucide-react";
import type { SupabaseAuthUser } from "@/app/api/users/route";

export default function UsersPage() {
  return (
    <AuthGuard>
      <ConsoleShell>
        <UsersContent />
      </ConsoleShell>
    </AuthGuard>
  );
}

function UsersContent() {
  const [users, setUsers] = useState<SupabaseAuthUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selected user for Slide-over detail drawer
  const [selectedUser, setSelectedUser] = useState<SupabaseAuthUser | null>(null);
  const [drawerTab, setDrawerTab] = useState<"overview" | "raw">("overview");

  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<SupabaseAuthUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Add user form
  const [addFormData, setAddFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        // Update selected user reference if open
        if (selectedUser) {
          const updated = (data.users || []).find((u: SupabaseAuthUser) => u.id === selectedUser.id);
          if (updated) setSelectedUser(updated);
        }
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addFormData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể tạo tài khoản");
      }

      setIsAddUserOpen(false);
      setAddFormData({ email: "", password: "", full_name: "", phone: "" });
      await fetchUsers();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUserSubmit = async () => {
    if (!deletingUser) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/users?userId=${encodeURIComponent(deletingUser.id)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể xóa người dùng");
      }

      if (selectedUser?.id === deletingUser.id) {
        setSelectedUser(null);
      }
      setDeletingUser(null);
      await fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Đã xảy ra lỗi khi xóa người dùng");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q))
    );
  });

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Quản trị Người dùng (Supabase Auth & SSO)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Quản lý tài khoản, danh tính, phương thức đăng nhập và kiểm tra dữ liệu định danh theo thời gian thực
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={isLoading}
            className="gap-1.5 text-xs border-0 bg-white dark:bg-card shadow-xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setAddFormData({ email: "", password: "", full_name: "", phone: "" });
              setFormError(null);
              setIsAddUserOpen(true);
            }}
            className="gap-1.5 text-xs border-0 shadow-xs cursor-pointer font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <UserPlus className="h-4 w-4" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Main Table Card - Borderless */}
      <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden w-full max-w-full">
        <div className="p-4 sm:p-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-base font-bold flex items-center gap-2 text-foreground">
                <span>Danh sách Tài khoản Supabase</span>
                <span className="border-0 bg-primary/10 text-primary text-xs font-mono font-medium px-2.5 py-0.5 rounded-full">
                  {users.length} tài khoản
                </span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                spellCheck={false}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo email, tên, UID, phone..."
                className="w-full h-8.5 pl-8 pr-3 text-xs bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
        </div>

        <div className="p-0 w-full max-w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs text-muted-foreground">Đang tải danh sách người dùng từ Supabase...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-xs text-muted-foreground space-y-2">
              <Users className="h-8 w-8 text-muted-foreground/30 mx-auto" />
              <p>Không tìm thấy người dùng nào phù hợp với từ khóa.</p>
            </div>
          ) : (
            <div className="w-full max-w-full overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[920px]">
                <thead className="bg-[#faf8f4] dark:bg-muted/40 text-[#6e6a61] dark:text-slate-300 font-mono uppercase text-xs tracking-wider">
                  <tr>
                    <th className="py-3 px-5">Tên hiển thị & Email</th>
                    <th className="py-3 px-5">UID (User ID)</th>
                    <th className="py-3 px-5">Số điện thoại</th>
                    <th className="py-3 px-5">Providers</th>
                    <th className="py-3 px-5">Ngày tạo</th>
                    <th className="py-3 px-5">Đăng nhập cuối</th>
                    <th className="py-3 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f2eb] dark:divide-border/30 text-sm">
                  {filteredUsers.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedUser(item)}
                      className={`hover:bg-[#fbf9f5] dark:hover:bg-muted/20 transition-colors cursor-pointer ${
                        selectedUser?.id === item.id ? "bg-[#f8f5ed] dark:bg-muted/30" : ""
                      }`}
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          {item.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="h-8 w-8 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary shrink-0">
                              {item.name ? item.name.slice(0, 2).toUpperCase() : "US"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-foreground truncate max-w-[190px] flex items-center gap-1.5">
                              <span>{item.name}</span>
                              {item.isCurrentUser && (
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-primary/10 text-primary">
                                  Bạn
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 font-mono truncate max-w-[190px]">
                              <Mail className="h-3 w-3 shrink-0" />
                              {item.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-5 font-mono text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground group">
                          <Fingerprint className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate max-w-[140px]" title={item.id}>
                            {item.id}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(item.id, item.id);
                            }}
                            title="Sao chép UID"
                            className="p-1 hover:text-foreground text-muted-foreground transition-colors cursor-pointer"
                          >
                            {copiedId === item.id ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-5 font-mono text-xs text-muted-foreground">
                        {item.phone || "-"}
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="flex flex-wrap gap-1.5">
                          {item.providers.map((p) => (
                            <span
                              key={p}
                              className="text-xs font-medium px-2 py-0.5 rounded-md bg-[#f4f1ea] dark:bg-muted text-[#6b675e] capitalize"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-5 text-muted-foreground font-mono text-xs whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="py-3.5 px-5 text-muted-foreground font-mono text-xs whitespace-nowrap">
                        {formatDate(item.lastSignInAt)}
                      </td>

                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedUser(item)}
                            title="Xem chi tiết người dùng"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#f4f1ea] dark:hover:bg-muted transition-colors cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            disabled={item.isCurrentUser}
                            onClick={() => setDeletingUser(item)}
                            title={
                              item.isCurrentUser
                                ? "Không thể xóa tài khoản của chính bạn"
                                : "Xóa tài khoản này"
                            }
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              item.isCurrentUser
                                ? "opacity-30 cursor-not-allowed text-muted-foreground"
                                : "text-destructive hover:bg-destructive/10"
                            }`}
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

      {/* Slide-over User Detail Drawer (Giống giao diện Supabase User Detail) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="border-0 bg-white dark:bg-card shadow-2xl w-full max-w-lg h-full flex flex-col p-6 space-y-5 overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#f5f2eb] dark:border-border/40">
              <div className="flex items-center gap-3">
                {selectedUser.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                    {selectedUser.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-foreground font-display">
                    {selectedUser.name}
                  </h3>
                  <div className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
                    <span>{selectedUser.email}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedUser.email, "drawer-email")}
                      className="hover:text-foreground cursor-pointer"
                    >
                      {copiedId === "drawer-email" ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3 opacity-60 hover:opacity-100" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs: Overview & Raw JSON */}
            <div className="flex items-center gap-2 border-b border-[#f5f2eb] dark:border-border/40 pb-2">
              <button
                type="button"
                onClick={() => setDrawerTab("overview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  drawerTab === "overview"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-[#f6f3eb] dark:hover:bg-muted"
                }`}
              >
                Overview (Tổng quan)
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab("raw")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  drawerTab === "raw"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-[#f6f3eb] dark:hover:bg-muted"
                }`}
              >
                Raw JSON
              </button>
            </div>

            {drawerTab === "overview" ? (
              <div className="space-y-5 text-xs">
                {/* User UID */}
                <div className="p-3.5 rounded-xl bg-[#f8f6f0] dark:bg-muted/30 space-y-1">
                  <div className="text-[11px] text-muted-foreground font-mono uppercase">User UID</div>
                  <div className="font-mono text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>{selectedUser.id}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedUser.id, "drawer-uid")}
                      className="p-1 hover:text-foreground cursor-pointer"
                    >
                      {copiedId === "drawer-uid" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Metadata Fields */}
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#f5f2eb] dark:border-border/40">
                    <span className="text-muted-foreground font-sans">Created at:</span>
                    <span className="text-foreground">{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#f5f2eb] dark:border-border/40">
                    <span className="text-muted-foreground font-sans">Updated at:</span>
                    <span className="text-foreground">{formatDate(selectedUser.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#f5f2eb] dark:border-border/40">
                    <span className="text-muted-foreground font-sans">Confirmed at:</span>
                    <span className="text-foreground">{formatDate(selectedUser.confirmedAt)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#f5f2eb] dark:border-border/40">
                    <span className="text-muted-foreground font-sans">Last signed in:</span>
                    <span className="text-foreground">{formatDate(selectedUser.lastSignInAt)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#f5f2eb] dark:border-border/40">
                    <span className="text-muted-foreground font-sans">Số điện thoại:</span>
                    <span className="text-foreground">{selectedUser.phone || "-"}</span>
                  </div>
                </div>

                {/* Provider Information */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="font-bold text-foreground text-sm font-display">
                    Provider Information
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Các nhà cung cấp định danh xác thực tài khoản này
                  </p>

                  <div className="space-y-2">
                    {selectedUser.providers.map((p) => (
                      <div
                        key={p}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#f8f6f0] dark:bg-muted/30"
                      >
                        <div className="flex items-center gap-2 font-medium capitalize text-foreground">
                          <Globe className="h-4 w-4 text-primary" />
                          <span>{p}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-[11px] font-semibold">
                          ● Enabled
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger zone in drawer */}
                {!selectedUser.isCurrentUser && (
                  <div className="pt-4 border-t border-[#f5f2eb] dark:border-border/40">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingUser(selectedUser)}
                      className="w-full gap-2 text-xs font-semibold h-9 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                      Xóa người dùng này khỏi Supabase
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleCopy(JSON.stringify(selectedUser.rawUser, null, 2), "raw-json")
                    }
                    className="text-xs h-8 border-0 bg-[#f7f5ef] shadow-xs cursor-pointer"
                  >
                    {copiedId === "raw-json" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500 mr-1" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 mr-1" />
                    )}
                    Sao chép JSON
                  </Button>
                </div>
                <div className="p-4 rounded-xl bg-[#f8f6f0] dark:bg-muted/20 font-mono text-xs overflow-x-auto max-h-[500px]">
                  <pre className="text-foreground/90">
                    {JSON.stringify(selectedUser.rawUser, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Thêm người dùng mới */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="border-0 bg-white dark:bg-card shadow-2xl rounded-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#f5f2eb] dark:border-border/40">
              <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-emerald-600" />
                Thêm người dùng vào Supabase Auth
              </h3>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
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
                  onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full h-9 px-3 bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
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
                  onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full h-9 px-3 bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Tên hiển thị (Họ và tên)</label>
                <input
                  type="text"
                  spellCheck={false}
                  value={addFormData.full_name}
                  onChange={(e) => setAddFormData({ ...addFormData, full_name: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full h-9 px-3 bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Số điện thoại (Tùy chọn)</label>
                <input
                  type="tel"
                  spellCheck={false}
                  value={addFormData.phone}
                  onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                  placeholder="+84 901 234 567"
                  className="w-full h-9 px-3 bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddUserOpen(false)}
                  className="border-0 bg-[#f7f5ef] hover:bg-[#efebe2] text-xs h-9"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-xs h-9 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="border-0 bg-white dark:bg-card shadow-2xl rounded-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-destructive/10 text-destructive">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Xác nhận xóa Người dùng</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tài khoản này sẽ bị xóa hoàn toàn khỏi Supabase Auth và cơ sở dữ liệu.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-destructive/5 text-xs text-destructive space-y-1">
              <div>
                Người dùng: <strong>{deletingUser.name}</strong>
              </div>
              <div>Email: {deletingUser.email}</div>
              <div className="font-mono text-[11px] truncate">UID: {deletingUser.id}</div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingUser(null)}
                className="border-0 bg-[#f7f5ef] hover:bg-[#efebe2] text-xs h-9"
              >
                Hủy bỏ
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isSubmitting}
                onClick={handleDeleteUserSubmit}
                className="text-xs h-9 font-semibold"
              >
                {isSubmitting ? "Đang xóa..." : "Xác nhận Xóa vĩnh viễn"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
