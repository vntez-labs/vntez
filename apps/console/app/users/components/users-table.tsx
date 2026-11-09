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
  Pencil,
  Shield,
} from "lucide-react";
import { useUsersStore } from "../users-store";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { formatDate } from "@workspace/ui/lib/formatters";
import type { SupabaseAuthUser } from "@/app/api/users/route";

function getRoleBadge(roleStr: string) {
  const r = roleStr.toLowerCase();
  if (r.includes("admin")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-violet-500/10 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:text-violet-300">
        <Shield className="h-3 w-3" /> Admin
      </span>
    );
  }
  if (r.includes("dev")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 px-2 py-0.5 text-xs font-semibold text-sky-700 dark:text-sky-300">
        Developer
      </span>
    );
  }
  if (r.includes("operator")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
        Operator
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
      Viewer
    </span>
  );
}

export function UsersTable() {
  const {
    users,
    isLoading,
    searchQuery,
    copiedId,
    handleCopy,
    selectedUser,
    setSelectedUser,
    openEditUserModal,
    setDeletingUser,
  } = useUsersStore();

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-card shadow-xs rounded-2xl overflow-hidden w-full max-w-full border border-border">
      <div className="p-0 w-full max-w-full">
        {isLoading ? (
          <div className="w-full max-w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wider font-mono border-b border-border">
                <tr>
                  <th className="py-3.5 px-6">Người dùng</th>
                  <th className="py-3.5 px-5">UID</th>
                  <th className="py-3.5 px-5">Vai trò (Role)</th>
                  <th className="py-3.5 px-5">Đăng nhập cuối</th>
                  <th className="py-3.5 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-28 rounded" />
                          <Skeleton className="h-3 w-40 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5"><Skeleton className="h-4 w-20 rounded" /></td>
                    <td className="py-4 px-5"><Skeleton className="h-5 w-16 rounded-md" /></td>
                    <td className="py-4 px-5"><Skeleton className="h-4 w-28 rounded" /></td>
                    <td className="py-4 px-6 text-right"><Skeleton className="h-8 w-16 rounded-lg ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-xs text-muted-foreground space-y-2">
            <Users className="h-8 w-8 text-muted-foreground/30 mx-auto" />
            <p>Không tìm thấy người dùng nào phù hợp với từ khóa.</p>
          </div>
        ) : (
          <div className="w-full max-w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wider font-mono border-b border-border">
                <tr>
                  <th className="py-3.5 px-6">Người dùng</th>
                  <th className="py-3.5 px-5">UID</th>
                  <th className="py-3.5 px-5">Vai trò (Role)</th>
                  <th className="py-3.5 px-5">Đăng nhập cuối</th>
                  <th className="py-3.5 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filteredUsers.map((item: SupabaseAuthUser) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedUser(item)}
                    className={`hover:bg-muted/50 transition-colors cursor-pointer ${
                      selectedUser?.id === item.id ? "bg-muted" : ""
                    }`}
                  >
                    {/* User display name & email */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        {item.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="h-8 w-8 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0">
                            {item.name ? item.name.slice(0, 2).toUpperCase() : "US"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground truncate max-w-[200px] flex items-center gap-1.5">
                            <span>{item.name}</span>
                            {item.isCurrentUser && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-primary/10 text-primary">
                                Bạn
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 font-mono truncate max-w-[200px]">
                            <Mail className="h-3 w-3 shrink-0" />
                            {item.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* UID */}
                    <td className="py-3.5 px-5 font-mono text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground group">
                        <Fingerprint className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate max-w-[130px]" title={item.id}>
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

                    {/* Role Column */}
                    <td className="py-3.5 px-5">{getRoleBadge(item.role)}</td>

                    {/* Last login */}
                    <td className="py-3.5 px-5 text-muted-foreground font-mono text-xs whitespace-nowrap">
                      {formatDate(item.lastSignInAt, true)}
                    </td>

                    {/* Actions: Edit, View, Delete */}
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => openEditUserModal(item)}
                          title="Chỉnh sửa vai trò & người dùng"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-foreground bg-zinc-100/70 hover:bg-zinc-200/70 dark:bg-zinc-800/60 dark:hover:bg-zinc-700/60 transition-colors cursor-pointer"
                        >
                          <Pencil className="h-3 w-3" />
                          <span>Sửa</span>
                        </button>

                        {/* View Drawer */}
                        <button
                          type="button"
                          onClick={() => setSelectedUser(item)}
                          title="Xem chi tiết người dùng"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete */}
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
                              : "text-rose-500 hover:bg-rose-500/10"
                          }`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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
