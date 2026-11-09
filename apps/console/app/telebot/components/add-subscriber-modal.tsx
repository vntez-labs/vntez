"use client";

import React, { useState } from "react";
import { X, UserPlus, Send } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/toaster";
import { api } from "@workspace/ui/lib/api-client";
import { useAuthStore } from "@workspace/auth/store";

interface AddSubscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddSubscriberModal({ isOpen, onClose, onSuccess }: AddSubscriberModalProps) {
  const { user } = useAuthStore();
  const [email, setEmail] = useState(user?.email || "");
  const [chatId, setChatId] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState(user?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !chatId.trim()) {
      toast.error("Vui lòng nhập Email và Telegram Chat ID");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post<{ success: boolean; error?: string }>("/api/telebot/subscribers", {
        email: email.trim(),
        chat_id: chatId.trim(),
        username: username.trim() || undefined,
        first_name: firstName.trim() || undefined,
        user_id: user?.sub,
        status: "active",
      });

      if (res.success) {
        toast.success(`Đã liên kết subscriber ${email} thành công!`);
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || "Không thể lưu subscriber");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi lưu subscriber";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-foreground">
                Thêm / Liên kết Subscriber
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Đăng ký email nhận thông báo Telegram vào database
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Email định danh <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. hnamhocit@gmail.com"
              className="w-full h-9 px-3 rounded-xl bg-card text-foreground border border-input shadow-2xs text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Telegram Chat ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="e.g. 9114027704"
              className="w-full h-9 px-3 rounded-xl bg-card text-foreground border border-input shadow-2xs text-xs font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
            <p className="text-[11px] text-muted-foreground">
              Chat ID có thể lấy qua bot @userinfobot hoặc @vntez_bot trên Telegram
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Username Telegram</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. hnamhocit"
                className="w-full h-9 px-3 rounded-xl bg-card text-foreground border border-input text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Tên hiển thị</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Nam Nguyễn"
                className="w-full h-9 px-3 rounded-xl bg-card text-foreground border border-input text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="rounded-xl text-xs">
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="rounded-xl text-xs font-semibold gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Đang lưu..." : "Lưu Subscriber"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
