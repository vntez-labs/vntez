"use client";

import React from "react";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { STANDARD_APP_ACTIONS } from "@/lib/apps-repository";

interface PermissionsMatrixGridProps {
  appId: string;
  resources: string[];
  rolePerms: Set<string>;
  onTogglePerm: (resource: string, action: string) => void;
  onGrantAllForResource: (resource: string) => void;
}

export function PermissionsMatrixGrid({
  appId,
  resources,
  rolePerms,
  onTogglePerm,
  onGrantAllForResource,
}: PermissionsMatrixGridProps) {
  const hasPerm = (resource: string, action: string) => {
    const key = `${appId}:${resource}:${action}`;
    return rolePerms.has(key) || rolePerms.has(`${appId}:*:*`);
  };

  return (
    <div className="rounded-2xl bg-card border border-border shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 text-muted-foreground font-mono uppercase tracking-wider border-b border-border">
            <tr>
              <th className="py-3 px-4 min-w-[140px]">Tài nguyên (Resource)</th>
              {STANDARD_APP_ACTIONS.map((action) => (
                <th key={action} className="py-3 px-3 text-center min-w-[85px]">
                  <span className="font-mono text-[10px]">{action}</span>
                </th>
              ))}
              <th className="py-3 px-3 text-center">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-sans">
            {resources.map((resource) => (
              <tr key={resource} className="hover:bg-muted/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-foreground font-display capitalize">
                    {resource}
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    {appId}:{resource}:*
                  </div>
                </td>
                {STANDARD_APP_ACTIONS.map((action) => {
                  const checked = hasPerm(resource, action);
                  return (
                    <td key={action} className="py-3 px-3 text-center">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => onTogglePerm(resource, action)}
                      />
                    </td>
                  );
                })}
                <td className="py-3 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => onGrantAllForResource(resource)}
                    className="text-[10px] text-primary hover:underline font-medium cursor-pointer"
                  >
                    Chọn hết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
