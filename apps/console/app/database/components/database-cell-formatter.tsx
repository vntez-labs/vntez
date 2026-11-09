"use client";

import React from "react";
import { Check, X, Mail, ExternalLink, Calendar } from "lucide-react";
import type { ColumnMeta } from "../types";

/**
 * Returns a distinct colored badge for database column headers based on data type.
 */
export function getColumnTypeBadge(col: ColumnMeta) {
  const typeStr = (col.format || col.type || "text").toLowerCase();

  if (col.isPrimaryKey) {
    return (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
        PK • {typeStr}
      </span>
    );
  }

  if (typeStr.includes("uuid")) {
    return (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        uuid
      </span>
    );
  }

  if (typeStr.includes("int") || typeStr.includes("num") || typeStr.includes("float")) {
    return (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
        {typeStr}
      </span>
    );
  }

  if (typeStr.includes("bool")) {
    return (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        bool
      </span>
    );
  }

  if (typeStr.includes("time") || typeStr.includes("date")) {
    return (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
        timestamptz
      </span>
    );
  }

  if (typeStr.includes("json")) {
    return (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
        jsonb
      </span>
    );
  }

  if (typeStr.includes("[]") || typeStr.includes("array")) {
    return (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
        array
      </span>
    );
  }

  return (
    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
      text
    </span>
  );
}

/**
 * Rich, syntax-colored cell value renderer for database data grid.
 */
export function formatDatabaseCell(val: any, colName: string, isPrimaryKey?: boolean) {
  if (val === null || val === undefined) {
    return (
      <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-[11px] font-mono text-zinc-400 dark:text-zinc-500 italic border border-zinc-200 dark:border-zinc-700/40 select-none">
        NULL
      </span>
    );
  }

  if (typeof val === "boolean") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold ${
          val
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
        }`}
      >
        {val ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
        {String(val)}
      </span>
    );
  }

  if (typeof val === "object") {
    const isArr = Array.isArray(val);
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-mono max-w-[280px] truncate ${
          isArr
            ? "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20"
            : "bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20"
        }`}
        title={JSON.stringify(val, null, 2)}
      >
        {isArr ? `[${val.length} mục]` : "{...} JSON"}
      </span>
    );
  }

  if (typeof val === "number") {
    return (
      <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
        {val.toLocaleString("vi-VN")}
      </span>
    );
  }

  const strVal = String(val);

  // 1. Primary Key / Slug / UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(strVal);
  if (isPrimaryKey || isUuid) {
    return (
      <span
        className="font-mono text-[13px] font-semibold text-amber-600 dark:text-amber-400 tracking-tight truncate block max-w-[340px]"
        title={strVal}
      >
        {strVal}
      </span>
    );
  }

  if (colName === "slug") {
    return (
      <span
        className="font-mono text-[13px] font-semibold text-amber-600 dark:text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 truncate block max-w-[340px]"
        title={strVal}
      >
        {strVal}
      </span>
    );
  }

  // 2. Status Badge with live status dot
  const lowerVal = strVal.toLowerCase();
  if (colName === "status" || ["active", "approved", "published", "pending", "rejected", "blocked"].includes(lowerVal)) {
    if (["active", "approved", "published"].includes(lowerVal)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
          {strVal}
        </span>
      );
    }
    if (lowerVal === "pending") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
          {strVal}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
        {strVal}
      </span>
    );
  }

  // 3. Category Chip
  if (colName === "category") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
        {strVal}
      </span>
    );
  }

  // 4. Email address
  if (colName.includes("email") || (strVal.includes("@") && strVal.includes(".") && strVal.length < 60)) {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-xs text-sky-600 dark:text-sky-400">
        <Mail className="h-3.5 w-3.5 shrink-0" />
        {strVal}
      </span>
    );
  }

  // 5. External Link / URL
  if (strVal.startsWith("http://") || strVal.startsWith("https://")) {
    return (
      <a
        href={strVal}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 font-mono text-xs text-blue-600 dark:text-blue-400 hover:underline"
        title={strVal}
      >
        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate max-w-[280px]">{strVal}</span>
      </a>
    );
  }

  // 6. ISO Date / Timestamptz
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(strVal)) {
    try {
      const d = new Date(strVal);
      const formatted = d.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      return (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/10 text-orange-700 dark:text-orange-300 font-mono text-xs border border-orange-500/15"
          title={strVal}
        >
          <Calendar className="h-3 w-3 text-orange-500 shrink-0" />
          {formatted}
        </span>
      );
    } catch {
      // Fallback
    }
  }

  // 7. General text (titles, excerpts, descriptions)
  return (
    <span
      className="text-sm font-normal text-foreground block max-w-[360px] truncate"
      title={strVal}
    >
      {strVal}
    </span>
  );
}
