"use client";

import React from "react";
import { Search, Ban, CheckCircle, UserCheck } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { useTelebotStore } from "../telebot-store";

export function SubscribersTable() {
  const { subscribers, searchQuery, setSearchQuery, toggleBlockSubscriber } = useTelebotStore();

  const filtered = subscribers.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.chat_id.toString().includes(q) ||
      (s.username && s.username.toLowerCase().includes(q)) ||
      (s.first_name && s.first_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-3">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0c121e] p-4 rounded-2xl border border-[#ebe7df] dark:border-border shadow-xs">
        <div>
          <h4 className="text-sm font-bold text-foreground">Danh Sách Subscribers ({filtered.length})</h4>
          <p className="text-xs text-muted-foreground">Người dùng đã kích hoạt lệnh /start với Telegram Bot</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo ID, username..."
            className="w-full h-8 pl-8 pr-3 rounded-xl border border-[#ebe7df] dark:border-border bg-[#faf8f4] dark:bg-muted text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#ebe7df] dark:border-border bg-white dark:bg-[#0c121e] shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#ebe7df] dark:border-border bg-[#faf8f4] dark:bg-[#111726]/60">
              <th className="py-3 px-4 font-semibold text-foreground">Chat ID</th>
              <th className="py-3 px-4 font-semibold text-foreground">Người dùng</th>
              <th className="py-3 px-4 font-semibold text-foreground">Ngày tham gia</th>
              <th className="py-3 px-4 font-semibold text-foreground">Tags</th>
              <th className="py-3 px-4 font-semibold text-foreground">Trạng thái</th>
              <th className="py-3 px-4 font-semibold text-foreground text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ebe7df] dark:divide-border font-sans">
            {filtered.map((s) => {
              const isActive = s.status === "active";
              return (
                <tr key={s.chat_id} className="hover:bg-[#fbf9f5] dark:hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-foreground">
                    {s.chat_id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {s.first_name} {s.last_name || ""}
                      </span>
                      {s.username && (
                        <span className="text-[11px] text-muted-foreground font-mono">
                          @{s.username}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(s.joined_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {s.tags && s.tags.length > 0 ? (
                        s.tags.map((t) => (
                          <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {t}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        isActive
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40"
                          : "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40"
                      }`}
                    >
                      {isActive ? "Hoạt động" : "Bị chặn"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleBlockSubscriber(s.chat_id)}
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors ${
                        isActive
                          ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Ban className="h-3 w-3" /> Chặn
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-3 w-3" /> Mở khóa
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
