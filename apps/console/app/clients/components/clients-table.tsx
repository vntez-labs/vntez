"use client";

import React from "react";
import {
  ShieldCheck,
  Plus,
  Search,
  Copy,
  Check,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useClientsStore } from "../clients-store";

export function ClientsTable() {
  const {
    clients,
    isLoading,
    searchQuery,
    setSearchQuery,
    copiedId,
    handleCopy,
    openCreateModal,
    openEditModal,
    setDeletingClient,
  } = useClientsStore();

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
            <p className="text-xs text-muted-foreground">
              Đang tải danh sách Client từ Supabase...
            </p>
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
                        <span className="truncate max-w-[160px]">
                          {client.client_id}
                        </span>
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
  );
}
