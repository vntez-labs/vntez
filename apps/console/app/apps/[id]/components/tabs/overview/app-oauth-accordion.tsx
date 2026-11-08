"use client";

import React, { useState } from "react";
import {
  IconCopy,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconRefresh,
  IconShieldLock,
  IconChevronDown,
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { AutoResizeTextarea } from "@workspace/ui/components/auto-resize-textarea";
import type { AppItem } from "@workspace/ui/lib/content-types";

interface AppOAuthAccordionProps {
  app: AppItem;
  onUpdate: (updates: Partial<AppItem>) => void;
  onRotateSecret: () => void;
  isRotatingSecret: boolean;
  copiedField: string | null;
  onCopy: (text: string, fieldId: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AppOAuthAccordion({
  app,
  onUpdate,
  onRotateSecret,
  isRotatingSecret,
  copiedField,
  onCopy,
}: AppOAuthAccordionProps) {
  const [showSecret, setShowSecret] = useState(false);
  const redirectUrisText = (app.redirectUris || []).join("\n");

  const handleRedirectsChange = (val: string) => {
    const list = val
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    onUpdate({ redirectUris: list });
  };

  return (
    <div className="p-6 flex flex-col justify-between h-full space-y-6 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <IconShieldLock className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-display text-foreground">
                Chứng thực OAuth 2.0 PKCE & Khóa Bí mật
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                Tích hợp Per-App
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Client ID, Client Secret và danh sách Redirect URIs callback
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Row 1: Client ID & Client Secret */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Client ID */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Client ID (Định danh OAuth)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={app.clientId || `vntez_${app.id.replace(/-/g, "_")}`}
                  className="flex-1 px-3.5 py-2 text-xs font-mono rounded-xl bg-muted/50 border border-input text-foreground shadow-2xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onCopy(
                      app.clientId || `vntez_${app.id.replace(/-/g, "_")}`,
                      "clientId"
                    )
                  }
                  className="h-9 px-3 rounded-xl cursor-pointer"
                >
                  {copiedField === "clientId" ? (
                    <IconCheck className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Client Secret */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-foreground">
                  Client Secret (Bảo mật)
                </label>
                <button
                  type="button"
                  onClick={onRotateSecret}
                  disabled={isRotatingSecret}
                  className="text-[11px] text-primary hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <IconRefresh
                    className={`h-3 w-3 ${isRotatingSecret ? "animate-spin" : ""}`}
                  />
                  <span>Cấp mới Secret</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type={showSecret ? "text" : "password"}
                  readOnly
                  value={app.clientSecret || "••••••••••••••••••••••••••••••••"}
                  className="flex-1 px-3.5 py-2 text-xs font-mono rounded-xl bg-muted/50 border border-input text-foreground shadow-2xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSecret(!showSecret)}
                  className="h-9 px-2.5 rounded-xl cursor-pointer"
                >
                  {showSecret ? (
                    <IconEyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <IconEye className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onCopy(app.clientSecret || "", "clientSecret")
                  }
                  className="h-9 px-3 rounded-xl cursor-pointer"
                >
                  {copiedField === "clientSecret" ? (
                    <IconCheck className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Row 2: Redirect URIs */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Redirect URIs (Mỗi dòng một URL Callback)
            </label>
            <div className="p-3 rounded-xl bg-secondary/30 dark:bg-zinc-900/40 border border-border/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
              <AutoResizeTextarea
                minRows={3}
                value={redirectUrisText}
                onChange={(e) => handleRedirectsChange(e.target.value)}
                placeholder="https://app.vntez.net/auth/callback&#10;http://localhost:3000/auth/callback"
                className="text-xs font-mono leading-relaxed text-foreground placeholder:text-muted-foreground/40 bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Internal App Flag (Anchored at the bottom) */}
        <div className="pt-4 flex items-center justify-between border-t border-border/40 mt-auto">
          <div>
            <span className="text-xs font-semibold text-foreground block">
              Ứng dụng Hệ thống Nội bộ (Internal App)
            </span>
            <span className="text-[11px] text-muted-foreground">
              Tự động bỏ qua bước yêu cầu đồng ý cấp quyền (Consent screen) khi người dùng SSO đăng nhập.
            </span>
          </div>
          <Checkbox
            checked={Boolean(app.isInternal)}
            onCheckedChange={(checked) => onUpdate({ isInternal: checked })}
          />
        </div>
      </div>
    </div>
  );
}
