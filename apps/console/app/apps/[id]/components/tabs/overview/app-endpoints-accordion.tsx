"use client";

import React from "react";
import { IconServer, IconChevronDown } from "@tabler/icons-react";
import type { AppItem } from "@workspace/ui/lib/content-types";

interface AppEndpointsAccordionProps {
  app: AppItem;
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (updates: Partial<AppItem>) => void;
}

export function AppEndpointsAccordion({
  app,
  isOpen,
  onToggle,
  onUpdate,
}: AppEndpointsAccordionProps) {
  return (
    <div
      className={`rounded-2xl bg-card border border-border shadow-xs transition-all relative ${
        isOpen ? "z-10 overflow-visible" : "overflow-hidden"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 cursor-pointer rounded-2xl transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <IconServer className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-foreground">
              Điểm cuối Dịch vụ & Nền tảng Triển khai
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Cấu hình CTA link và danh sách nền tảng hỗ trợ
            </p>
          </div>
        </div>
        <IconChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={
            isOpen ? "overflow-visible min-h-0" : "overflow-hidden min-h-0"
          }
        >
          <div className="p-6 pt-5 border-t border-border/60 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Website Trực tiếp (Live Website URL)
              </label>
              <input
                type="text"
                placeholder="https://solotype.vntez.com (để trống nếu chưa có)"
                value={app.url || app.ctaLink || ""}
                onChange={(e) =>
                  onUpdate({
                    url: e.target.value.trim() ? e.target.value.trim() : null,
                    ctaLink: e.target.value,
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Nền tảng Hỗ trợ (Cách nhau bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={(app.platforms || []).join(", ")}
                onChange={(e) =>
                  onUpdate({
                    platforms: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
