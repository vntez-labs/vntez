"use client";

import React from "react";
import { Play, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { usePermissionsStore } from "../permissions-store";

export function EvaluatorCard() {
  const {
    evalUserId,
    evalPermission,
    evalResult,
    isEvaluating,
    setEvalUserId,
    setEvalPermission,
    runEvaluation,
  } = usePermissionsStore();

  return (
    <div className="rounded-2xl bg-white dark:bg-card p-5 shadow-xs space-y-4">
      <h4 className="text-sm font-bold text-foreground">
        Thử Nghiệm Quyền (Live Evaluator)
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">
            User ID / Client ID
          </label>
          <input
            type="text"
            value={evalUserId}
            onChange={(e) => setEvalUserId(e.target.value)}
            className="w-full h-9 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="user_123..."
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">
            Quyền cần kiểm tra
          </label>
          <input
            type="text"
            value={evalPermission}
            onChange={(e) => setEvalPermission(e.target.value)}
            className="w-full h-9 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 px-3 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="users:read"
          />
        </div>

        <div className="flex items-end">
          <Button
            onClick={runEvaluation}
            disabled={isEvaluating}
            size="sm"
            className="w-full h-9 gap-1.5 rounded-xl shadow-xs"
          >
            <Play className="h-3.5 w-3.5" />
            {isEvaluating ? "Đang thử..." : "Kiểm tra quyền"}
          </Button>
        </div>
      </div>

      {evalResult && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium animate-fade-in ${
            evalResult.allowed
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-500/10 text-rose-700 dark:text-rose-300"
          }`}
        >
          {evalResult.allowed ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{evalResult.message}</span>
        </div>
      )}
    </div>
  );
}
