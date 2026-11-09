"use client"

import React from "react"
import { Search, ExternalLink, Sparkles, FileCode2, Download } from "lucide-react"
import type { DocSection, AppFilter } from "../types"
import { DocsAppSwitcher } from "./docs-app-switcher"

export function DocsSidebar({
  activeFilter,
  currentApp,
  onSelectApp,
  sections,
  activeSectionId,
  onSelectSection,
  searchQuery,
  onSearchChange,
}: {
  activeFilter: string
  currentApp: AppFilter
  onSelectApp: (id: string) => void
  sections: DocSection[]
  activeSectionId: string
  onSelectSection: (id: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
}) {
  return (
    <aside className="w-full xl:w-56 2xl:w-60 shrink-0 border-b xl:border-b-0 xl:border-r border-black/[0.06] dark:border-white/[0.06] p-3.5 lg:p-4 flex flex-col xl:sticky xl:top-16 xl:h-[calc(100vh-64px)]">
      {/* Top Scrollable Content (App Switcher, Search, Navigation) */}
      <div className="flex-1 min-h-0 space-y-4 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pr-0.5">
        {/* App Switcher */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Chọn ứng dụng / Dịch vụ
          </p>
          <DocsAppSwitcher activeFilter={activeFilter} onSelectApp={onSelectApp} />
        </div>

        {/* Instant Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Tìm trong ${currentApp.label}...`}
            className="w-full rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.03] pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Endpoints & Guides Navigation Tree for Selected App */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <span>Endpoints & Guides</span>
            <span className="font-mono text-[9px] text-slate-400">
              {sections.length} mục
            </span>
          </div>

          {sections.length === 0 ? (
            <p className="px-2 py-4 text-xs text-slate-400 italic">
              Không tìm thấy mục tài liệu phù hợp trong {currentApp.label}.
            </p>
          ) : (
            <nav className="space-y-1">
              {sections.map((sec) => {
                const isActive = sec.id === activeSectionId
                const method = sec.endpoint?.method
                const cleanTitle = sec.title.replace(/^[0-9.]+\s*/, "")

                return (
                  <button
                    key={sec.id}
                    onClick={() => onSelectSection(sec.id)}
                    title={sec.title}
                    className={`group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-all cursor-pointer ${
                      isActive
                        ? "bg-slate-100 dark:bg-white/[0.08] text-slate-900 dark:text-white font-semibold ring-1 ring-black/[0.04] dark:ring-white/[0.08]"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                    }`}
                  >
                    {/* Subtle active bar indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-primary" />
                    )}

                    {method ? (
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold shrink-0 border ${
                          method === "POST"
                            ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
                            : method === "GET"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : method === "PUT"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {method}
                      </span>
                    ) : (
                      <sec.icon className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-primary transition-colors" />
                    )}

                    <span className="truncate flex-1">
                      {cleanTitle}
                    </span>

                    {sec.subtabs?.some((t) => t.key === "aiPrompt" || t.key === "prompt") && (
                      <span title="Hỗ trợ AI Prompt" className="shrink-0">
                        <Sparkles className="h-3 w-3 text-amber-500" />
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          )}
        </div>
      </div>

      {/* OpenAPI Spec Export & Tester Callouts Pushed to Bottom */}
      <div className="mt-auto pt-3 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2 shrink-0">
        <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-slate-50/60 dark:bg-white/[0.02] p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <FileCode2 className="h-3.5 w-3.5 text-primary" />
              openapi.json (3.1)
            </span>
            <span className="text-[10px] text-emerald-500 font-mono">v3.1.0</span>
          </div>

          <div className="flex items-center gap-1.5 pt-1 text-[11px]">
            <a
              href={`/docs/openapi/${activeFilter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md bg-white dark:bg-white/5 border border-black/[0.06] dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-primary hover:border-primary/30 transition-all font-medium"
            >
              <span>Xem JSON</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
            <a
              href={`/docs/openapi/${activeFilter}`}
              download={`${activeFilter}-openapi.json`}
              className="flex items-center justify-center p-1 px-2 rounded-md bg-white dark:bg-white/5 border border-black/[0.06] dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-primary hover:border-primary/30 transition-all"
              title="Tải về file openapi.json"
            >
              <Download className="h-3 w-3 opacity-70" />
            </a>
          </div>
        </div>

        <a
          href="https://iam.vntez.cloud/developers"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl border border-black/[0.08] dark:border-white/[0.08] p-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium hover:text-primary hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all"
        >
          <span>Mở VNTEZ Tester</span>
          <ExternalLink className="h-3 w-3 opacity-70" />
        </a>
      </div>
    </aside>
  )
}
