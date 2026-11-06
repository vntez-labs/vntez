"use client";

import React from "react";
import { Search, Ban, CheckCircle } from "lucide-react";
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-card p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-foreground">Danh Sách Subscribers</h4>
          <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-mono font-medium text-muted-foreground">
            {filtered.length}
          </span>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo ID, username..."
            className="w-full h-8 pl-8 pr-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-white dark:bg-card shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-50/70 dark:bg-zinc-900/40 text-muted-foreground uppercase font-mono tracking-wider">
              <th className="py-3 px-4 font-semibold">Chat ID</th>
              <th className="py-3 px-4 font-semibold">Người dùng</th>
              <th className="py-3 px-4 font-semibold">Ngày tham gia</th>
              <th className="py-3 px-4 font-semibold">Tags</th>
              <th className="py-3 px-4 font-semibold">Trạng thái</th>
              <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100/80 dark:divide-zinc-800/40">
            {filtered.map((s) => {
              const isActive = s.status === "active";
              return (
                <tr key={s.chat_id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-foreground">
                    {s.chat_id}
                  </td>
                  <td className="py-3 px-4 text-foreground">
                    <div className="font-semibold">{s.first_name || "Unknown"}</div>
                    {s.username && (
                      <div className="text-[11px] font-mono text-muted-foreground">@{s.username}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground font-mono">
                    {new Date(s.joined_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {s.tags && s.tags.length > 0 ? (
                        s.tags.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px] text-muted-foreground">
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={`text-[10px] border-0 font-medium ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isActive ? "Active" : "Blocked"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleBlockSubscriber(s.chat_id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Ban className="h-3 w-3" /> Chặn
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3" /> Mở chặn
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
