"use client";

import React, { useState } from "react";
import { X, Play, RotateCcw, ExternalLink, Terminal, Sparkles } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { SqlCodeEditor } from "./sql-code-editor";
import { SqlResultsViewer } from "./sql-results-viewer";
import type { SqlQueryResult } from "@/lib/sql-executor";

interface DatabaseSqlRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTable?: string;
  onTableMutated?: () => void;
}

const TEMPLATES = [
  { label: "Xem Apps", sql: "SELECT id, name, url, status FROM apps LIMIT 10;" },
  { label: "Xem App Requests", sql: "SELECT * FROM app_requests LIMIT 10;" },
  { label: "Xem Blog Posts", sql: "SELECT slug, title, category, author, status FROM blog_posts LIMIT 10;" },
  { label: "Xem Mã OAuth gần đây", sql: "SELECT code, client_id, user_id, used FROM oauth_codes ORDER BY created_at DESC LIMIT 10;" },
  { label: "Liệt kê Bảng (SHOW TABLES)", sql: "SHOW TABLES;" },
];

export function DatabaseSqlRunnerModal({
  isOpen,
  onClose,
  defaultTable,
  onTableMutated,
}: DatabaseSqlRunnerModalProps) {
  const initialSql = defaultTable
    ? `SELECT * FROM ${defaultTable} LIMIT 10;`
    : "SELECT id, name, category FROM apps LIMIT 10;";

  const [sql, setSql] = useState(initialSql);
  const [result, setResult] = useState<SqlQueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExecute = async () => {
    if (!sql.trim()) return;
    setIsExecuting(true);
    try {
      const res = await fetch("/api/database/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: sql }),
      });
      const data = await res.json();
      setResult(data);

      const lower = sql.trim().toLowerCase();
      if (lower.startsWith("insert") || lower.startsWith("update") || lower.startsWith("delete")) {
        onTableMutated?.();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể gửi câu truy vấn";
      setResult({ success: false, error: msg });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                <span>Trình Thực thi SQL Trực tiếp</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-primary/10 text-primary">
                  Live Runner
                </span>
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Thực thi truy vấn SQL trực tiếp, có Syntax Highlight & Autocomplete gợi ý thông minh
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Quick Snippet Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-semibold text-muted-foreground shrink-0 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" />
              Mẫu nhanh:
            </span>
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.label}
                type="button"
                onClick={() => setSql(tmpl.sql)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-muted text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer border border-border/50"
              >
                {tmpl.label}
              </button>
            ))}
          </div>

          {/* Code Editor */}
          <SqlCodeEditor
            value={sql}
            onChange={setSql}
            onExecute={handleExecute}
          />

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-muted-foreground font-mono">
              Phím tắt: <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-foreground">Ctrl</kbd> +{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-foreground">Enter</kbd> để chạy truy vấn
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSql("")}
                className="text-xs h-8.5 rounded-xl cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                <span>Xóa trắng</span>
              </Button>
              <Button
                size="sm"
                onClick={handleExecute}
                disabled={isExecuting || !sql.trim()}
                className="text-xs h-8.5 rounded-xl font-semibold gap-1.5 shadow-xs cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{isExecuting ? "Đang chạy..." : "Thực thi SQL"}</span>
              </Button>
            </div>
          </div>

          {/* Query Results */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-foreground">Kết quả Truy vấn</div>
            <SqlResultsViewer result={result} isLoading={isExecuting} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-2.5 border-t border-border bg-muted/20 flex items-center justify-between text-xs">
          <a
            href="https://supabase.com/dashboard/project/stbswcnsitztbusqrdhi/sql/new"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium text-[11px]"
          >
            <span>Mở Supabase SQL Editor chính thức (DDL Superuser)</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <Button variant="ghost" size="xs" onClick={onClose} className="cursor-pointer">
            Đóng cửa sổ
          </Button>
        </div>
      </div>
    </div>
  );
}
