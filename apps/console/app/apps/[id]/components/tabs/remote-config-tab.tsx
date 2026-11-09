"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Power, ExternalLink } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { JsonCodeEditor } from "@/components/json-code-editor";
import { useAppWorkspaceStore } from "../../app-workspace-store";

export function RemoteConfigTab() {
  const { app, updateApp, copyToClipboard, copiedField } = useAppWorkspaceStore();

  const config = (app?.remoteConfig || {}) as Record<string, unknown>;
  const isEnabled = Boolean(config.enabled ?? (Object.keys(config).length > 0));

  const [jsonText, setJsonText] = useState(() => JSON.stringify(config, null, 2));

  // Sync jsonText when app changes from outside
  useEffect(() => {
    if (app?.remoteConfig) {
      setJsonText(JSON.stringify(app.remoteConfig, null, 2));
    }
  }, [app?.remoteConfig]);

  if (!app) return null;

  const endpointUrl = `/api/apps/${app.id}/remote-config`;

  const handleEnable = () => {
    const initialConfig = {
      maintenance_mode: false,
      min_client_version: "1.0.0",
      enable_ai_agent: true,
      telemetry_rate: 1.0,
      ...config,
      enabled: true,
    };
    setJsonText(JSON.stringify(initialConfig, null, 2));
    updateApp({ remoteConfig: initialConfig });
  };

  const handleDisable = () => {
    if (!confirm(`Bạn có chắc muốn vô hiệu hóa Remote Config cho ứng dụng [${app.name}]?`)) {
      return;
    }
    const disabledConfig = { ...config, enabled: false };
    setJsonText(JSON.stringify(disabledConfig, null, 2));
    updateApp({ remoteConfig: disabledConfig });
  };

  const handleJsonChange = (text: string) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === "object" && parsed !== null) {
        updateApp({ remoteConfig: parsed });
      }
    } catch {
      // Allow user to continue editing while syntax is transiently invalid
    }
  };

  // If remote config is disabled for this app, display opt-in banner
  if (!isEnabled) {
    return (
      <div className="p-8 sm:p-12 rounded-2xl bg-card border border-border shadow-xs text-center max-w-xl mx-auto space-y-5 my-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mx-auto">
          <Power className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-foreground">
            Edge Remote Config Chưa Được Kích Hoạt
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Kích hoạt tính năng này để cho phép ứng dụng <strong>{app.name}</strong> kéo các tham số
            cấu hình động theo thời gian thực mà không cần deploy lại mã nguồn.
          </p>
        </div>
        <Button
          onClick={handleEnable}
          className="gap-2 px-5 font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
        >
          <Power className="h-4 w-4" />
          <span>Kích Hoạt Edge Remote Config</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 min-w-0">
      {/* 1. Status & Endpoint Control Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                Edge Remote Config đang hoạt động
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                Postgres Live
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <span>Endpoint:</span>
              <code className="text-[11px] font-mono text-primary font-semibold select-all">
                {endpointUrl}
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard(endpointUrl, "endpoint_url")}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                title="Sao chép URL điểm cuối"
              >
                {copiedField === "endpoint_url" ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
              <a
                href={endpointUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                title="Kiểm tra phản hồi API trực tiếp trên tab mới"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDisable}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          title="Tắt cấu hình từ xa cho ứng dụng này"
        >
          <Power className="h-3.5 w-3.5" />
          <span>Tắt Remote Config</span>
        </button>
      </div>

      {/* 2. Full Monaco JSON Editor with Real-Time Validation & Syntax Highlighting */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground">
            Cấu hình JSON Thời gian thực (Runtime Payload)
          </h4>
          <span className="text-[11px] text-muted-foreground">
            Tự động định dạng cú pháp JSON, kiểm tra lỗi và cập nhật trực tiếp vào cơ sở dữ liệu
          </span>
        </div>

        <JsonCodeEditor
          value={jsonText}
          onChange={handleJsonChange}
          minHeight="380px"
        />
      </div>
    </div>
  );
}
