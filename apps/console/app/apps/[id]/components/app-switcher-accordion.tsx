"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  IconChevronDown,
  IconCheck,
  IconPlus,
  IconApps,
  IconSearch,
} from "@tabler/icons-react";
import type { AppItem } from "@workspace/ui/lib/content-types";

interface AppSwitcherAccordionProps {
  currentApp: AppItem;
}

export function AppSwitcherAccordion({ currentApp }: AppSwitcherAccordionProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchAllApps() {
      try {
        const res = await fetch("/api/apps");
        const data = await res.json();
        if (data.success && Array.isArray(data.apps)) {
          setApps(data.apps);
        }
      } catch {
        // fail silently
      }
    }
    fetchAllApps();
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredApps = apps.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Dropdown / Accordion Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-card hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-foreground transition-all cursor-pointer shadow-2xs font-display font-bold text-sm sm:text-base group"
        title="Chọn hoặc chuyển đổi giữa các Ứng dụng"
      >
        <span
          className="h-2.5 w-2.5 rounded-full shrink-0"
          style={{ backgroundColor: currentApp.color || "#fb291a" }}
        />
        <span className="truncate max-w-[160px] sm:max-w-[220px]">{currentApp.name}</span>
        <IconChevronDown
          className={`h-4 w-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* Accordion / Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#0c121e] border border-zinc-200/90 dark:border-zinc-800 shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95">
          {/* Search box */}
          <div className="p-2.5 border-b border-zinc-100 dark:border-zinc-800/80">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm ứng dụng theo tên hoặc slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* List of Apps */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5">
            {filteredApps.map((item) => {
              const isSelected = item.id === currentApp.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/apps/${item.id}`);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.avatarUrl}
                        alt={item.name}
                        className="h-7 w-7 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-2xs"
                        style={{ backgroundColor: item.color || "#fb291a" }}
                      >
                        <IconApps className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs truncate">{item.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate font-mono">
                        {item.id}
                      </div>
                    </div>
                  </div>

                  {isSelected && <IconCheck className="h-4 w-4 text-primary shrink-0 ml-2" />}
                </button>
              );
            })}

            {filteredApps.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground">
                Không tìm thấy ứng dụng phù hợp
              </div>
            )}
          </div>

          {/* Create new App shortcut */}
          <div className="p-2 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push("/apps/editor");
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <IconPlus className="h-3.5 w-3.5" />
              <span>Đăng ký Ứng dụng Mới</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
