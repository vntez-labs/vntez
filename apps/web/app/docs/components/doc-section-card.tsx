"use client"

import React from "react"
import { Badge } from "@workspace/ui/components/badge"
import { IconCheck, IconCopy } from "@tabler/icons-react"
import type { DocSection } from "../docs-data"

interface DocSectionCardProps {
  section: DocSection
  currentSubtabKey: string
  copiedId: string | null
  onSelectSubtab: (subtabKey: string) => void
  onCopy: (id: string, text: string) => void
}

export function DocSectionCard({
  section,
  currentSubtabKey,
  copiedId,
  onSelectSubtab,
  onCopy,
}: DocSectionCardProps) {
  const IconComp = section.icon
  const activeSubtab =
    section.subtabs?.find((st) => st.key === currentSubtabKey) || section.subtabs?.[0]
  const currentCode = activeSubtab ? activeSubtab.code : section.code || ""
  const copyKey = `${section.id}-${currentSubtabKey}`

  return (
    <article
      id={section.id}
      className="scroll-mt-28 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#0c121e] p-6 sm:p-8 space-y-6 shadow-sm"
    >
      {/* Section Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.04] dark:border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center text-[#fb291a]">
            <IconComp className="size-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
              {section.category}
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {section.title}
            </h2>
          </div>
        </div>

        <Badge variant="brand" className="font-mono text-[11px] font-semibold w-fit">
          {section.badge}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
        {section.desc}
      </p>

      {/* Subtabs if present */}
      {section.subtabs && section.subtabs.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {section.subtabs.map((tab) => {
            const isTabActive = currentSubtabKey === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => onSelectSubtab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  isTabActive
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Code Container with Copy Button */}
      <div className="relative rounded-xl bg-[#080d16] border border-white/[0.08] overflow-hidden group">
        {/* Code Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06] text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-slate-600" />
            <span>{activeSubtab?.label || section.title.split(" — ")[0]}</span>
          </div>

          <button
            onClick={() => onCopy(copyKey, currentCode)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {copiedId === copyKey ? (
              <>
                <IconCheck className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-sans text-[11px]">Đã copy</span>
              </>
            ) : (
              <>
                <IconCopy className="size-3.5" />
                <span className="font-sans text-[11px]">Copy code</span>
              </>
            )}
          </button>
        </div>

        {/* Preformatted Code */}
        <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200 overflow-x-auto max-h-[460px] scrollbar-thin">
          <pre className="whitespace-pre">{currentCode}</pre>
        </div>
      </div>
    </article>
  )
}
