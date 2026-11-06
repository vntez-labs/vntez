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
    resources,
    actions,
  } = usePermissionsStore();

  return (
    <div className="rounded-2xl border border-[#ebe7df] dark:border-border bg-white dark:bg-[#0c121e] p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Bộ Thử Nghiệm Quyền (Quick Evaluator)</h4>
          <p className="text-xs text-muted-foreground">Kiểm tra ngay lập tức xem User ID có quyền thực hiện hành động cụ thể hay không</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">
            User ID (hoặc Client ID)
          </label>
          <input
            type="text"
            value={evalUserId}
            onChange={(e) => setEvalUserId(e.target.value)}
            className="w-full h-9 rounded-xl border border-[#ebe7df] dark:border-border bg-[#faf8f4] dark:bg-muted/50 px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="user_123..."
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">
            Quyền cần thử nghiệm (Resource:Action)
          </label>
          <input
            type="text"
            value={evalPermission}
            onChange={(e) => setEvalPermission(e.target.value)}
            className="w-full h-9 rounded-xl border border-[#ebe7df] dark:border-border bg-[#faf8f4] dark:bg-muted/50 px-3 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="users:read:self"
          />
        </div>

        <div className="flex items-end">
          <Button
            onClick={runEvaluation}
            disabled={isEvaluating}
            className="w-full h-9 rounded-xl gap-2 text-xs"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            {isEvaluating ? "Đang đánh giá..." : "Đánh giá quyền"}
          </Button>
        </div>
      </div>

      {evalResult && (
        <div
          className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-medium ${
            evalResult.allowed
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
              : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40"
          }`}
        >
          {evalResult.allowed ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <span>{evalResult.message}</span>
        </div>
      )}
    </div>
  );
}
