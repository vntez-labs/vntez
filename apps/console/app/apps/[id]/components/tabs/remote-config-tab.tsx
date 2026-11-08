"use client";

import React, { useState } from "react";
import {
  IconAdjustmentsHorizontal,
  IconCopy,
  IconCheck,
  IconPlus,
  IconTrash,
  IconPower,
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { JsonCodeEditor } from "@/components/json-code-editor";
import { useAppWorkspaceStore } from "../../app-workspace-store";

export function RemoteConfigTab() {
  const { app, updateApp, copyToClipboard, copiedField } =
    useAppWorkspaceStore();

  const config = (app?.remoteConfig || {}) as Record<string, unknown>;
  const isEnabled = Boolean(config.enabled ?? (Object.keys(config).length > 0));

  const [jsonText, setJsonText] = useState(() =>
    JSON.stringify(config, null, 2)
  );
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState("");

  if (!app) return null;

  const endpointUrl = `/api/apps/${app.id}/remote-config`;

  const handleEnable = () => {
    const initialConfig = {
      enabled: true,
      maintenance_mode: false,
      min_client_version: "1.0.0",
    };
    setJsonText(JSON.stringify(initialConfig, null, 2));
    updateApp({ remoteConfig: initialConfig });
  };

  const handleDisable = () => {
    if (
      !confirm(
        `Bạn có chắc muốn vô hiệu hóa Remote Config cho ứng dụng [${app.name}]?`
      )
    )
      return;
    const disabledConfig = { enabled: false };
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

  const handleQuickToggle = (key: string, currentVal: boolean) => {
    const updated = { ...config, [key]: !currentVal };
    setJsonText(JSON.stringify(updated, null, 2));
    updateApp({ remoteConfig: updated });
  };

  const handleDeleteKey = (key: string) => {
    const next = { ...config };
    delete next[key];
    setJsonText(JSON.stringify(next, null, 2));
    updateApp({ remoteConfig: next });
  };

  const handleAddKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;

    let parsedVal: unknown = newVal.trim();
    if (newVal === "true") parsedVal = true;
    else if (newVal === "false") parsedVal = false;
    else if (!isNaN(Number(newVal)) && newVal !== "") parsedVal = Number(newVal);

    const updated = { ...config, [newKey.trim()]: parsedVal };
    setJsonText(JSON.stringify(updated, null, 2));
    updateApp({ remoteConfig: updated });
    setNewKey("");
    setNewVal("");
  };

  // If remote config is not active for this app, display opt-in banner
  if (!isEnabled) {
    return (
      <div className="p-8 sm:p-12 rounded-2xl bg-card border border-border shadow-xs text-center max-w-xl mx-auto space-y-5 my-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto shadow-xs">
          <IconAdjustmentsHorizontal className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold font-display text-foreground">
            Kích hoạt Edge Remote Config
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ứng dụng [{app.name}] chưa kích hoạt cấu hình từ xa. Bật tính năng
            này để quản lý các cờ tính năng (Feature Flags) và tham số thời gian
            thực phân phối qua Edge API.
          </p>
        </div>
        <Button
          onClick={handleEnable}
          className="h-10 px-5 gap-2 text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
        >
          <IconPlus className="h-4 w-4" />
          <span>Kích hoạt Remote Config cho {app.name}</span>
        </Button>
      </div>
    );
  }

  // Filter out meta keys for quick flags display
  const dynamicKeys = Object.entries(config).filter(([k]) => k !== "enabled");
  const booleanFlags = dynamicKeys.filter(([, v]) => typeof v === "boolean");

  return (
    <div className="space-y-6 min-w-0">
      {/* 1. Header Toolbar: Status & API Endpoint */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="text-xs font-semibold text-foreground">
              Edge Remote Config đang hoạt động
            </div>
            <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
              Endpoint:{" "}
              <button
                type="button"
                onClick={() => copyToClipboard(endpointUrl, "endpointUrl")}
                className="hover:underline text-primary inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{endpointUrl}</span>
                {copiedField === "endpointUrl" ? (
                  <IconCheck className="h-3 w-3 text-emerald-500" />
                ) : (
                  <IconCopy className="h-3 w-3 opacity-60" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDisable}
          className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 px-3 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto font-medium"
        >
          <IconPower className="h-3.5 w-3.5" />
          <span>Tắt Remote Config</span>
        </button>
      </div>

      {/* 2. Dynamic Feature Flags (Boolean Keys) */}
      {booleanFlags.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {booleanFlags.map(([key, val]) => (
            <div
              key={key}
              className="p-4 rounded-2xl bg-card border border-border shadow-2xs flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <span className="text-xs font-mono font-semibold text-foreground block truncate">
                  {key}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {val ? "Đang bật (true)" : "Đang tắt (false)"}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Checkbox
                  checked={Boolean(val)}
                  onCheckedChange={() => handleQuickToggle(key, Boolean(val))}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteKey(key)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-rose-500 transition-colors"
                  title="Xóa cờ này"
                >
                  <IconTrash className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Add Custom Parameter Form */}
      <form
        onSubmit={handleAddKey}
        className="p-4 rounded-2xl bg-card border border-border shadow-2xs flex flex-col sm:flex-row sm:items-center gap-3"
      >
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tên khóa (Key, ví dụ: enable_new_ui, api_timeout)..."
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-card border border-input text-foreground font-mono shadow-2xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Giá trị (true, false, số hoặc chuỗi)..."
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-card border border-input text-foreground font-mono shadow-2xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
          />
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={!newKey.trim()}
          className="h-9 px-4 gap-1.5 text-xs rounded-xl font-semibold cursor-pointer shrink-0"
        >
          <IconPlus className="h-3.5 w-3.5" />
          <span>Thêm tham số</span>
        </Button>
      </form>

      {/* 4. Syntax Highlighted JSON Code Editor with Line Numbers */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-foreground">
          Cấu hình JSON Thời gian thực (Runtime Payload)
        </label>
        <JsonCodeEditor
          value={jsonText}
          onChange={handleJsonChange}
          minHeight="280px"
        />
      </div>
    </div>
  );
}
