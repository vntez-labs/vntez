"use client";

import React, { useState } from "react";
import { Sliders, Sparkles, Code2, Copy, Check, ShieldCheck, Wrench } from "lucide-react";
import { CONFIG_PRESETS, type ConfigPreset } from "./remote-config-presets";

interface RemoteConfigInspectorProps {
  appId: string;
  parsedConfig: Record<string, unknown> | null;
  onApplyPreset: (presetConfig: Record<string, unknown>) => void;
}

export function RemoteConfigInspector({
  appId,
  parsedConfig,
  onApplyPreset,
}: RemoteConfigInspectorProps) {
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const keys = parsedConfig ? Object.keys(parsedConfig) : [];

  const clientSnippet = `// Edge / Client Integration
const res = await fetch("/api/apps/${appId}/remote-config", {
  cache: "no-store",
});
const config = await res.json();
if (config.maintenance_mode) {
  // Chuyển hướng trang bảo trì
}`;

  const copySnippet = () => {
    navigator.clipboard.writeText(clientSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const renderValueBadge = (val: unknown) => {
    if (typeof val === "boolean") {
      return (
        <span
          className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold ${
            val
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          }`}
        >
          {String(val)}
        </span>
      );
    }
    if (typeof val === "number") {
      return (
        <span className="px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
          {val}
        </span>
      );
    }
    if (typeof val === "string") {
      return (
        <span className="px-1.5 py-0.5 rounded text-[11px] font-mono text-amber-700 dark:text-amber-300 truncate max-w-[120px] inline-block align-bottom">
          &quot;{val}&quot;
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 rounded text-[11px] font-mono text-purple-600 dark:text-purple-400">
        {typeof val}
      </span>
    );
  };

  return (
    <div className="p-4 space-y-5 text-xs">
      {/* 1. Parsed Key Inspector */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Sliders className="h-3.5 w-3.5 text-primary" />
            <span>Tham số đang hoạt động ({keys.length})</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">Live Schema</span>
        </div>

        {keys.length === 0 ? (
          <div className="p-3 text-center rounded-xl bg-card border border-dashed border-border text-muted-foreground text-[11px]">
            Chưa có cấu hình nào được thiết lập
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
            {keys.map((key) => (
              <div
                key={key}
                className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/70 text-[11px]"
              >
                <span className="font-mono font-medium text-foreground truncate max-w-[130px]" title={key}>
                  {key}
                </span>
                <div>{renderValueBadge(parsedConfig?.[key])}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Quick Preset Templates */}
      <div className="space-y-2.5 border-t border-border pt-4">
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Mẫu Cấu hình Nhanh</span>
        </div>

        <div className="space-y-2">
          {CONFIG_PRESETS.map((preset: ConfigPreset) => (
            <div
              key={preset.id}
              className="p-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/40 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-[11px]">{preset.name}</span>
                <button
                  type="button"
                  onClick={() => onApplyPreset(preset.config)}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {preset.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Edge Client Integration Snippet */}
      <div className="space-y-2 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Code2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Mã Tích hợp Edge SDK</span>
          </div>
          <button
            type="button"
            onClick={copySnippet}
            className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            {copiedSnippet ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Sao chép</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-2.5 rounded-xl bg-[#0a0f18] text-[#38bdf8] font-mono text-[11px] leading-relaxed overflow-x-auto border border-cyan-900/30">
          <code>{clientSnippet}</code>
        </pre>
      </div>
    </div>
  );
}
