"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Check, ExternalLink, Database } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import {
  PHASE_1_TABLES_SQL,
  PHASE_2_RLS_POLICIES_SQL,
  MIGRATION_SQL,
} from "../database-migration-sql";

interface DatabaseSqlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SqlPhase = "phase1" | "phase2" | "all";

export function DatabaseSqlModal({ isOpen, onClose }: DatabaseSqlModalProps) {
  const [activePhase, setActivePhase] = useState<SqlPhase>("phase1");
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentSql =
    activePhase === "phase1"
      ? PHASE_1_TABLES_SQL
      : activePhase === "phase2"
      ? PHASE_2_RLS_POLICIES_SQL
      : MIGRATION_SQL;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const monacoTheme = resolvedTheme === "dark" ? "vs-dark" : "light";

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2.5">
            <Database className="h-5 w-5 text-primary shrink-0" />
            <div>
              <h3 className="font-display font-bold text-base text-foreground">
                Cấu trúc DDL Schema (2 Đợt Migration)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Chia làm 2 đợt: Đợt 1 Tạo Bảng & Seed; Đợt 2 Bật RLS Policies
              </p>
            </div>
          </div>

          {/* Phase Selector Tabs */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border text-xs">
            <button
              type="button"
              onClick={() => setActivePhase("phase1")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                activePhase === "phase1"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Đợt 1: Tạo Bảng
            </button>
            <button
              type="button"
              onClick={() => setActivePhase("phase2")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                activePhase === "phase2"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Đợt 2: RLS Policies
            </button>
            <button
              type="button"
              onClick={() => setActivePhase("all")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                activePhase === "all"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tất cả
            </button>
          </div>
        </div>

        {/* Code Content with Monaco Editor Syntax Highlighting */}
        <div className="flex-1 overflow-hidden p-5">
          <div className="h-[440px] w-full rounded-2xl overflow-hidden border border-border shadow-inner">
            <Editor
              height="100%"
              language="sql"
              theme={monacoTheme}
              value={currentSql}
              options={{
                readOnly: true,
                fontSize: 13,
                fontFamily: "var(--font-mono, 'Fira Code', 'JetBrains Mono', Menlo, Consolas, monospace)",
                lineNumbers: "on",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 sm:px-6 border-t border-border bg-muted/30 flex flex-wrap items-center justify-between gap-3">
          <a
            href="https://supabase.com/dashboard/project/stbswcnsitztbusqrdhi/sql/new"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
          >
            <span>Mở Supabase SQL Editor</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="rounded-xl text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Đã sao chép!" : `Sao chép ${activePhase === "phase1" ? "Đợt 1" : activePhase === "phase2" ? "Đợt 2" : "Toàn bộ"}`}</span>
            </Button>
            <Button type="button" size="sm" onClick={onClose} className="rounded-xl text-xs font-semibold">
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
