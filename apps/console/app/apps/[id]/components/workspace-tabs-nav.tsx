"use client";

import React from "react";
import {
  IconKey,
  IconShieldCheck,
  IconFileCode,
  IconScale,
  IconAdjustmentsHorizontal,
  IconDeviceFloppy,
  IconCheck,
  IconExternalLink,
  IconFileText,
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { useAppWorkspaceStore } from "../app-workspace-store";
import type { WorkspaceTab } from "../types";

const TABS: {
  id: WorkspaceTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "overview",
    label: "Tổng quan & OAuth",
    icon: IconKey,
  },
  {
    id: "permissions",
    label: "Ma trận Phân quyền",
    icon: IconShieldCheck,
  },
  {
    id: "docs",
    label: "Tài liệu MDX",
    icon: IconFileCode,
  },
  {
    id: "legal",
    label: "Chính sách Pháp lý",
    icon: IconScale,
  },
  {
    id: "remote-config",
    label: "Remote Config",
    icon: IconAdjustmentsHorizontal,
  },
];

export function WorkspaceTabsNav() {
  const { activeTab, setActiveTab, app, isSaving, isDirty, saveChanges } =
    useAppWorkspaceStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
      {/* Segmented Button Group: White active background */}
      <div className="inline-flex p-1 rounded-2xl bg-muted/80 border border-border shadow-2xs gap-1 overflow-x-auto max-w-full no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-white dark:bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-card/40"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${isActive ? "text-primary" : "opacity-70"}`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Toolbar: Docs/Legal links & Primary Save Button */}
      {app && (
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <a
            href={`https://vntez-docs.vercel.app/docs/${app.id}`}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Xem trang Tài liệu"
          >
            <IconFileText className="h-3.5 w-3.5 text-primary" />
            <span>Docs</span>
            <IconExternalLink className="h-3 w-3 opacity-60" />
          </a>

          <Button
            size="sm"
            onClick={saveChanges}
            disabled={!isDirty || isSaving}
            className={`h-9 px-4 gap-2 text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition-all ${
              isDirty
                ? "bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/20"
                : "bg-muted text-muted-foreground hover:bg-muted cursor-default opacity-80"
            }`}
          >
            {isSaving ? (
              <>
                <IconDeviceFloppy className="h-4 w-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : isDirty ? (
              <>
                <IconDeviceFloppy className="h-4 w-4" />
                <span>Lưu thay đổi</span>
              </>
            ) : (
              <>
                <IconCheck className="h-4 w-4 text-emerald-500" />
                <span>Đã lưu</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
