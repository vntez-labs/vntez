"use client";

import React, { useState } from "react";
import { IconTestPipe, IconCheck, IconX } from "@tabler/icons-react";
import { STANDARD_APP_ACTIONS } from "@/lib/apps-repository";
import type { AppRole } from "@workspace/ui/lib/content-types";

interface PermissionsEvaluatorCardProps {
  appId: string;
  resources: string[];
  currentRole: AppRole;
  rolePerms: Set<string>;
}

export function PermissionsEvaluatorCard({
  appId,
  resources,
  currentRole,
  rolePerms,
}: PermissionsEvaluatorCardProps) {
  const [testAction, setTestAction] = useState("read:all");
  const [testResource, setTestResource] = useState(resources[0] || "users");

  const testKey = `${appId}:${testResource}:${testAction}`;
  const isTestAllowed = rolePerms.has(testKey) || rolePerms.has(`${appId}:*:*`);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
          <IconTestPipe className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-foreground font-display">
            Kiểm Tra Quyền Thực Thi ({currentRole.name})
          </h4>
          <p className="text-[11px] text-muted-foreground">
            Quyền kiểm tra: <code className="text-primary font-mono">{testKey}</code>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={testResource}
          onChange={(e) => setTestResource(e.target.value)}
          className="px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800"
        >
          {resources.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={testAction}
          onChange={(e) => setTestAction(e.target.value)}
          className="px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800"
        >
          {STANDARD_APP_ACTIONS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
            isTestAllowed
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
          }`}
        >
          {isTestAllowed ? <IconCheck className="h-3.5 w-3.5" /> : <IconX className="h-3.5 w-3.5" />}
          <span>{isTestAllowed ? "ĐƯỢC PHÉP" : "TỪ CHỐI"}</span>
        </div>
      </div>
    </div>
  );
}
