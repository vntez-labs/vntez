"use client";

import React, { useState } from "react";
import { Check, Copy, AlertTriangle, Download, Clock, Database } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { SqlQueryResult } from "@/lib/sql-executor";

interface SqlResultsViewerProps {
  result: SqlQueryResult | null;
  isLoading: boolean;
}

export function SqlResultsViewer({ result, isLoading }: SqlResultsViewerProps) {
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center justify-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-xs text-muted-foreground font-mono">Đang thực thi câu truy vấn SQL...</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-xs text-muted-foreground">
        Nhập câu lệnh SQL ở khung trên và nhấn "Thực thi (Ctrl+Enter)" để xem kết quả.
      </div>
    );
  }

  if (!result.success || result.error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 space-y-2">
        <div className="flex items-center gap-2 text-destructive font-semibold text-xs">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>Lỗi thực thi câu truy vấn</span>
        </div>
        <pre className="font-mono text-xs text-destructive/90 whitespace-pre-wrap break-words p-2 rounded-lg bg-destructive/10">
          {result.error}
        </pre>
      </div>
    );
  }

  const rows = result.data || [];
  const columns = result.columns && result.columns.length > 0
    ? result.columns
    : rows.length > 0 && rows[0]
    ? Object.keys(rows[0])
    : [];

  const handleCopyJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(rows, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCsv = () => {
    if (rows.length === 0) return;
    const header = columns.join(",");
    const body = rows
      .map((r) =>
        columns
          .map((col) => {
            const val = r[col];
            if (val === null || val === undefined) return "";
            const str = typeof val === "object" ? JSON.stringify(val) : String(val);
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sql-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden space-y-0">
      {/* Query Meta Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-muted/40 border-b border-border text-xs">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-[11px]">
            <Check className="h-3 w-3" /> Thành công
          </span>
          <span className="flex items-center gap-1 font-mono text-muted-foreground text-[11px]">
            <Clock className="h-3 w-3" />
            {result.executionTimeMs ?? 0}ms
          </span>
          <span className="flex items-center gap-1 font-mono text-muted-foreground text-[11px]">
            <Database className="h-3 w-3" />
            {result.rowCount ?? rows.length} dòng
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="xs"
            onClick={handleCopyJson}
            disabled={rows.length === 0}
            className="text-[11px] gap-1 cursor-pointer"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Đã chép" : "Sao chép JSON"}</span>
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={handleExportCsv}
            disabled={rows.length === 0}
            className="text-[11px] gap-1 cursor-pointer"
          >
            <Download className="h-3 w-3" />
            <span>Tải CSV</span>
          </Button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-h-[360px] overflow-auto">
        {rows.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            {result.message || "Không có dòng dữ liệu nào được trả về."}
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead className="sticky top-0 bg-muted/80 backdrop-blur-md border-b border-border z-10">
              <tr>
                <th className="w-10 px-3 py-2 text-center text-muted-foreground font-medium">#</th>
                {columns.map((col) => (
                  <th key={col} className="px-3 py-2 font-semibold text-foreground whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/40 transition-colors">
                  <td className="px-3 py-2 text-center text-muted-foreground text-[10px] select-none">
                    {idx + 1}
                  </td>
                  {columns.map((col) => {
                    const val = row[col];
                    const isObj = val !== null && typeof val === "object";
                    return (
                      <td key={col} className="px-3 py-2 whitespace-nowrap max-w-[240px] truncate text-foreground">
                        {isObj ? (
                          <span
                            className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-primary cursor-pointer hover:underline"
                            title={JSON.stringify(val, null, 2)}
                          >
                            {Array.isArray(val) ? `[${val.length} items]` : "{JSON}"}
                          </span>
                        ) : val === null || val === undefined ? (
                          <span className="text-muted-foreground/40 italic">null</span>
                        ) : typeof val === "boolean" ? (
                          <span className={val ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                            {String(val).toUpperCase()}
                          </span>
                        ) : (
                          String(val)
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
