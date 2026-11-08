"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@workspace/auth/store";
import { fixVietnameseEncoding } from "@workspace/auth/encoding";
import { Button } from "@workspace/ui/components/button";
import { User, Check, Loader2, Phone, Mail, Camera } from "lucide-react";

export function ProfileEditCard() {
  const { user, setUser } = useAuthStore();

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [phone, setPhone] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(fixVietnameseEncoding(user.name) || "");
      setAvatar(user.avatar || "");
      setPhone(typeof user.phone === "string" ? user.phone : "");
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (avatar) formData.append("oldUrl", avatar);
      formData.append("appId", "user_profile");

      const res = await fetch("/api/apps/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload ảnh thất bại");

      setAvatar(data.url);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Upload ảnh thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Tên hiển thị không được để trống.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          avatar: avatar.trim() || null,
          phone: phone.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lưu hồ sơ thất bại");

      if (data.user) {
        setUser(data.user);
        setSuccessMessage("Đã lưu thông tin hồ sơ thành công!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Lỗi khi lưu hồ sơ");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-card border border-zinc-200/70 dark:border-zinc-800/70 shadow-xs rounded-2xl p-6 sm:p-7 space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2 text-foreground font-display">
            <User className="h-4 w-4 text-primary" />
            Hồ sơ Quản trị viên
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cập nhật tên hiển thị, ảnh đại diện và số điện thoại liên hệ
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative shrink-0">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt={name || "Avatar"}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-primary/20 shadow-xs"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl font-bold font-mono shadow-xs">
                {name ? name.slice(0, 2).toUpperCase() : "AD"}
              </div>
            )}

            <label className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-primary text-white shadow-xs hover:bg-primary/90 cursor-pointer transition-transform hover:scale-105">
              <Camera className="h-3.5 w-3.5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="text-xs font-semibold text-foreground block">
              {isUploading ? "Đang tải ảnh lên Cloudflare R2..." : "Ảnh đại diện tài khoản"}
            </span>
            <input
              type="text"
              placeholder="Hoặc dán trực tiếp đường dẫn URL ảnh..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full h-9 px-3 bg-secondary/30 dark:bg-zinc-900/60 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Name & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Tên hiển thị *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên..."
                className="w-full h-10 pl-9 pr-3 bg-secondary/30 dark:bg-zinc-900/60 border border-border rounded-xl text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Số điện thoại
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+84 912 345 678"
                className="w-full h-10 pl-9 pr-3 bg-secondary/30 dark:bg-zinc-900/60 border border-border rounded-xl text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Email Row (Readonly) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Địa chỉ Email định danh
            </label>
            <span className="text-[10px] font-mono text-primary font-semibold">VNTEZ IAM SSO</span>
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              disabled
              value={user?.email || "admin@vntez.com"}
              className="w-full h-10 pl-9 pr-3 bg-secondary/20 dark:bg-zinc-900/30 border border-border/50 rounded-xl text-xs font-mono text-muted-foreground cursor-not-allowed opacity-80"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            size="sm"
            disabled={isSaving || isUploading}
            className="h-9 px-5 gap-1.5 text-xs font-semibold rounded-xl cursor-pointer shadow-xs bg-primary hover:bg-primary/90 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Lưu thông tin hồ sơ</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
