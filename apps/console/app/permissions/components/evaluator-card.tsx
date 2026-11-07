"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  IconPlayerPlay,
  IconCircleCheck,
  IconCircleX,
  IconChevronDown,
  IconCheck,
  IconKey,
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { useAuth } from "@workspace/auth";
import { usePermissionsStore } from "../permissions-store";

export function EvaluatorCard() {
  const { user } = useAuth();
  const {
    resources,
    actions,
    evalUserId,
    evalPermission,
    evalResult,
    isEvaluating,
    setEvalUserId,
    setEvalPermission,
    runEvaluation,
  } = usePermissionsStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Automatically initialize evalUserId with the real logged-in user ID
  useEffect(() => {
    if (user && (!evalUserId || evalUserId === "admin_user_01")) {
      setEvalUserId(user.sub || user.email);
    }
  }, [user, evalUserId, setEvalUserId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute all available fixed permission keys
  const allPermissionKeys = useMemo(() => {
    const keys: string[] = ["*:*"];
    resources.forEach((res) => {
      keys.push(`${res}:*`);
      actions.forEach((act) => {
        keys.push(`${res}:${act}`);
      });
    });
    return keys;
  }, [resources, actions]);

  const filteredKeys = useMemo(() => {
    if (!evalPermission) return allPermissionKeys;
    const q = evalPermission.toLowerCase();
    return allPermissionKeys.filter((k) => k.toLowerCase().includes(q));
  }, [allPermissionKeys, evalPermission]);

  return (
    <div className="rounded-2xl bg-white dark:bg-card p-5 shadow-xs space-y-4">
      <div className="space-y-0.5">
        <h4 className="text-sm font-bold text-foreground">
          Thử Nghiệm Quyền (Live Evaluator)
        </h4>
        <p className="text-xs text-muted-foreground">
          Kiểm tra quyền hạn thực tế của tài khoản hiện tại hoặc Client ID bất kỳ theo RBAC engine
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* User ID / Client ID */}
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">
            User ID / Client ID
          </label>
          <input
            type="text"
            value={evalUserId}
            onChange={(e) => setEvalUserId(e.target.value)}
            className="w-full h-9 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary border border-zinc-200/80 dark:border-zinc-800"
            placeholder="usr_123 hoặc client_id..."
          />
        </div>

        {/* Permission Dropdown with Auto-Complete */}
        <div className="relative" ref={containerRef}>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">
            Quyền cần kiểm tra (Dropdown + Auto-complete)
          </label>
          <div className="relative">
            <input
              type="text"
              value={evalPermission}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setEvalPermission(e.target.value);
                setIsDropdownOpen(true);
              }}
              className="w-full h-9 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 pl-3 pr-8 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary border border-zinc-200/80 dark:border-zinc-800"
              placeholder="Chọn hoặc gõ: users:read..."
            />
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <IconChevronDown className={`h-3.5 w-3.5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Autocomplete Dropdown List */}
          {isDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-full max-h-56 overflow-y-auto rounded-2xl bg-white dark:bg-[#0c121e] border border-zinc-200/80 dark:border-zinc-800 p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100 space-y-0.5">
              {filteredKeys.length === 0 ? (
                <div className="p-2.5 text-center text-xs text-muted-foreground">
                  Không tìm thấy quyền phù hợp
                </div>
              ) : (
                filteredKeys.map((key) => {
                  const isSelected = key === evalPermission;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setEvalPermission(key);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer text-left ${
                        isSelected
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <IconKey className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{key}</span>
                      </div>
                      {isSelected && <IconCheck className="h-3.5 w-3.5 text-primary shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Evaluate Action Button */}
        <div className="flex items-end">
          <Button
            onClick={runEvaluation}
            disabled={isEvaluating}
            size="sm"
            className="w-full h-9 gap-1.5 rounded-xl shadow-xs font-semibold cursor-pointer"
          >
            <IconPlayerPlay className="h-3.5 w-3.5" />
            {isEvaluating ? "Đang kiểm tra..." : "Kiểm tra quyền"}
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
            <IconCircleCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <IconCircleX className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{evalResult.message}</span>
        </div>
      )}
    </div>
  );
}
