"use client";

import React from "react";
import {
  Users,
  Fingerprint,
  Mail,
  Copy,
  Check,
  Trash2,
  Eye,
} from "lucide-react";
import { useUsersStore } from "../users-store";

export function UsersTable() {
  const {
    users,
    isLoading,
    searchQuery,
    copiedId,
    handleCopy,
    selectedUser,
    setSelectedUser,
    setDeletingUser,
  } = useUsersStore();

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
    <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl rounded-t-none -mt-6 overflow-hidden w-full max-w-full">
      <div className="p-0 w-full max-w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-xs text-muted-foreground">
              Đang tải danh sách người dùng từ Supabase...
            </p>
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
                      selectedUser?.id === item.id
                        ? "bg-[#f8f5ed] dark:bg-muted/30"
                        : ""
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
                            {item.name
                              ? item.name.slice(0, 2).toUpperCase()
                              : "US"}
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
  );
}
