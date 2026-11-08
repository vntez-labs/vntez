"use client";

import React from "react";
import Link from "next/link";
import {
  IconArrowLeft,
  IconCheck,
  IconDeviceFloppy,
  IconExternalLink,
  IconApps,
  IconShieldLock,
  IconFileText,
  IconScale,
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { useAppWorkspaceStore } from "../app-workspace-store";
import { AppSwitcherAccordion } from "./app-switcher-accordion";

export function WorkspaceHeader() {
  const { app, isSaving, isDirty, saveChanges } = useAppWorkspaceStore();

  if (!app) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
      {/* App identity with interactive Accordion Switcher */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-white font-bold shrink-0 shadow-xs ring-2 ring-primary/10"
          style={{ backgroundColor: app.color || "#fb291a" }}
        >
          {app.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={app.avatarUrl}
              alt={app.name}
              className="h-full w-full rounded-2xl object-cover"
            />
          ) : (
            <IconApps className="h-6 w-6" />
          )}
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
            <Link
              href="/apps"
              className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              <IconArrowLeft className="h-3 w-3" />
              <span>Ứng dụng</span>
            </Link>
            <span>/</span>
            <span className="text-muted-foreground truncate">{app.category}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Accordion / Dropdown App Switcher */}
            <AppSwitcherAccordion currentApp={app} />

            <Badge
              variant="outline"
              className={`text-[10px] border-0 ${
                app.status === "active"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
              }`}
            >
              {app.status === "active" ? "Hoạt động" : "Bản nháp"}
            </Badge>

            {app.clientId && (
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-[11px] font-mono text-zinc-600 dark:text-zinc-300">
                <IconShieldLock className="h-3 w-3 text-primary opacity-80" />
                <span>{app.clientId}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href={`https://vntez-docs.vercel.app/docs/${app.id}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Xem trang Tài liệu công khai"
        >
          <IconFileText className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Xem Docs</span>
          <IconExternalLink className="h-3 w-3 opacity-60" />
        </a>

        <a
          href={`https://vntez-legal.vercel.app/${app.id}/privacy`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Xem trang Pháp lý công khai"
        >
          <IconScale className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Pháp lý</span>
          <IconExternalLink className="h-3 w-3 opacity-60" />
        </a>

        <Button
          onClick={saveChanges}
          disabled={isSaving || !isDirty}
          size="sm"
          className={`h-9 px-4 gap-2 text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer ${
            isDirty
              ? "bg-primary text-white hover:opacity-90 ring-2 ring-primary/20"
              : "opacity-70"
          }`}
        >
          {isSaving ? (
            <span>Đang lưu...</span>
          ) : isDirty ? (
            <>
              <IconDeviceFloppy className="h-4 w-4" />
              <span>Lưu thay đổi</span>
            </>
          ) : (
            <>
              <IconCheck className="h-4 w-4" />
              <span>Đã cập nhật</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
