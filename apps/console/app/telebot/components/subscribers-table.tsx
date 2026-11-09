"use client";

import React from "react";
import { Search, Ban, CheckCircle, UserPlus, Trash2, Mail, Link as LinkIcon } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { useTelebotStore } from "../telebot-store";

export function SubscribersTable() {
  const {
    subscribers,
    searchQuery,
    setSearchQuery,
    toggleBlockSubscriber,
    openAddModal,
    deleteSubscriber,
  } = useTelebotStore();

  const filtered = subscribers.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.chat_id.toString().includes(q) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.username && s.username.toLowerCase().includes(q)) ||
      (s.first_name && s.first_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-3">
      {/* Search & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl shadow-xs border border-border">
        <div className="flex items-center gap-2.5">
          <h4 className="text-sm font-bold text-foreground">Danh Sách Subscribers</h4>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-mono font-semibold text-foreground">
            {filtered.length}
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo email, Chat ID, username..."
              className="w-full h-9 pl-8 pr-3 rounded-xl bg-card border border-input shadow-2xs text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/60 transition-all"
            />
          </div>

          <Button
            size="sm"
            onClick={openAddModal}
            className="h-9 px-3.5 rounded-xl text-xs font-semibold gap-1.5 shadow-xs cursor-pointer shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>Thêm Subscriber</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-card shadow-xs border border-border">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">Chưa có người dùng đăng ký nhận thông báo.</p>
            <p className="text-[11px] text-muted-foreground max-w-md mx-auto">
              Người dùng có thể nhấp vào link Deep Link phía trên hoặc gửi lệnh{" "}
              <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">/start bind_&lt;user_id&gt;</code>{" "}
              tới{" "}
              <a
                href="https://t.me/vntez_bot"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                @vntez_bot
              </a>{" "}
              trên Telegram để tự động kết nối tài khoản.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-muted/60 text-muted-foreground uppercase font-mono tracking-wider border-b border-border text-xs">
                <th className="py-3.5 px-4 font-semibold">Email Nhận Tin</th>
                <th className="py-3.5 px-4 font-semibold">Chat ID</th>
                <th className="py-3.5 px-4 font-semibold">Người Dùng Telegram</th>
                <th className="py-3.5 px-4 font-semibold">Tài Khoản Liên Kết</th>
                <th className="py-3.5 px-4 font-semibold">Ngày Tham Gia</th>
                <th className="py-3.5 px-4 font-semibold">Trạng Thái</th>
                <th className="py-3.5 px-4 font-semibold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => {
                const isActive = s.status === "active";
                return (
                  <tr key={s.chat_id} className="hover:bg-muted/40 transition-colors">
                    {/* 1. Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-foreground">
                        <Mail className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-sans text-sm">{s.email || "Chưa có email"}</span>
                      </div>
                    </td>

                    {/* 2. Chat ID */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-foreground text-sm">
                      {s.chat_id}
                    </td>

                    {/* 3. Telegram User */}
                    <td className="py-3.5 px-4 text-foreground">
                      <div className="font-semibold text-sm">{s.first_name || "Unknown"}</div>
                      {s.username && (
                        <div className="text-xs font-mono text-muted-foreground">@{s.username}</div>
                      )}
                    </td>

                    {/* 4. Linked User ID */}
                    <td className="py-3.5 px-4">
                      {s.user_id ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-mono text-xs bg-sky-500/10 text-sky-600 dark:text-sky-400 font-medium">
                          <LinkIcon className="h-3 w-3" />
                          {String(s.user_id).slice(0, 8)}...
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Chưa gán UID</span>
                      )}
                    </td>

                    {/* 5. Joined Date */}
                    <td className="py-3.5 px-4 text-muted-foreground font-mono text-xs">
                      {new Date(s.joined_at).toLocaleDateString("vi-VN")}
                    </td>

                    {/* 6. Status */}
                    <td className="py-3.5 px-4">
                      <Badge
                        variant="outline"
                        className={`text-xs border-0 font-medium px-2 py-0.5 ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {isActive ? "Hoạt động" : "Bị chặn"}
                      </Badge>
                    </td>

                    {/* 7. Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleBlockSubscriber(s.chat_id)}
                          className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            isActive
                              ? "text-amber-600 hover:bg-amber-500/10"
                              : "text-emerald-600 hover:bg-emerald-500/10"
                          }`}
                          title={isActive ? "Chặn subscriber" : "Mở chặn"}
                        >
                          {isActive ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => deleteSubscriber(s.chat_id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Xóa subscriber khỏi cơ sở dữ liệu"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
