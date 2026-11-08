"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { useAppWorkspaceStore } from "./app-workspace-store";
import { WorkspaceTabsNav } from "./components/workspace-tabs-nav";
import { OverviewOAuthTab } from "./components/tabs/overview-oauth-tab";
import { PermissionsTab } from "./components/tabs/permissions-tab";
import { DocsTab } from "./components/tabs/docs-tab";
import { LegalTab } from "./components/tabs/legal-tab";
import { RemoteConfigTab } from "./components/tabs/remote-config-tab";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";

export default function AppWorkspacePage() {
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const id: string = typeof rawId === "string" ? rawId : "";

  return (
    <AuthGuard>
      <ConsoleShell>
        <AppWorkspaceContent id={id} />
      </ConsoleShell>
    </AuthGuard>
  );
}

function AppWorkspaceContent({ id }: { id: string }) {
  const {
    app,
    isLoading,
    errorMessage,
    successMessage,
    activeTab,
    fetchApp,
  } = useAppWorkspaceStore();

  useEffect(() => {
    if (id) {
      fetchApp(id);
    }
  }, [id, fetchApp]);

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl bg-card border border-border shadow-xs">
        <span className="text-xs text-muted-foreground animate-pulse font-mono">
          Đang tải không gian làm việc của ứng dụng [{id}]...
        </span>
      </div>
    );
  }

  if (errorMessage && !app) {
    return (
      <div className="p-8 rounded-2xl bg-card border border-rose-200 dark:border-rose-950/40 text-center space-y-3 shadow-xs">
        <IconAlertCircle className="h-8 w-8 text-rose-500 mx-auto" />
        <h3 className="text-sm font-bold text-foreground">Không tìm thấy ứng dụng</h3>
        <p className="text-xs text-muted-foreground">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full">
      {successMessage && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in duration-200">
          <IconCheck className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Segmented Button Group Navigation with Save Action */}
      <WorkspaceTabsNav />

      <div className="pt-1">
        {activeTab === "overview" && <OverviewOAuthTab />}
        {activeTab === "permissions" && <PermissionsTab />}
        {activeTab === "docs" && <DocsTab />}
        {activeTab === "legal" && <LegalTab />}
        {activeTab === "remote-config" && <RemoteConfigTab />}
      </div>
    </div>
  );
}
