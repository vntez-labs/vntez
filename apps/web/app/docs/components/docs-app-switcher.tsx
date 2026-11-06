"use client"

import React, { useState } from "react"
import { ChevronDown, Check, Box } from "lucide-react"
import { APP_FILTERS } from "../docs-data"

export function DocsAppSwitcher({
  activeFilter,
  onSelectApp,
}: {
  activeFilter: string
  onSelectApp: (appId: string) => void
}) {
  const [open, setOpen] = useState(false)
  const current = APP_FILTERS.find((f) => f.id === activeFilter) ?? APP_FILTERS[0]!

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.04] px-3.5 py-2.5 text-left text-xs font-semibold text-slate-800 dark:text-white shadow-xs hover:bg-slate-100/90 dark:hover:bg-white/[0.07] transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Box className="h-3.5 w-3.5" />
          </div>
          <span className="truncate">{current.label}</span>
          {current.version && (
            <span className="rounded bg-slate-200/80 dark:bg-white/10 px-1.5 py-0.5 font-mono text-[9px] text-slate-500 dark:text-slate-400">
              {current.version}
            </span>
          )}
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-12 z-50 w-full overflow-hidden rounded-xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#141221]/95 py-1 text-xs shadow-2xl backdrop-blur-xl">
            {APP_FILTERS.map((f) => {
              const active = f.id === activeFilter
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    onSelectApp(f.id)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between px-3.5 py-2 text-left transition-colors cursor-pointer ${
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {f.color && (
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: f.color }}
                      />
                    )}
                    <span>{f.label}</span>
                  </div>
                  {active && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
