"use client"

import React, { useState, useEffect } from "react"
import { Copy, Check, Terminal, ExternalLink, Code2 } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import type { DocSection } from "../types"
import { DocsCodeHighlight } from "./docs-code-highlight"

function getStatusMeta(status: number) {
  if (status >= 200 && status < 300) {
    return { short: "OK", is2xx: true, pill: "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30" }
  }
  if (status === 400) {
    return { short: "Bad Request", is2xx: false, pill: "bg-amber-500/20 text-amber-300 ring-amber-500/30" }
  }
  if (status === 401) {
    return { short: "Unauthorized", is2xx: false, pill: "bg-orange-500/20 text-orange-300 ring-orange-500/30" }
  }
  if (status === 403) {
    return { short: "Forbidden", is2xx: false, pill: "bg-rose-500/20 text-rose-300 ring-rose-500/30" }
  }
  if (status === 404) {
    return { short: "Not Found", is2xx: false, pill: "bg-rose-500/20 text-rose-300 ring-rose-500/30" }
  }
  if (status === 409) {
    return { short: "Conflict", is2xx: false, pill: "bg-amber-500/20 text-amber-300 ring-amber-500/30" }
  }
  if (status === 422) {
    return { short: "Unprocessable", is2xx: false, pill: "bg-amber-500/20 text-amber-300 ring-amber-500/30" }
  }
  if (status >= 500) {
    return { short: "Server Error", is2xx: false, pill: "bg-purple-500/20 text-purple-300 ring-purple-500/30" }
  }
  return { short: "Error", is2xx: false, pill: "bg-rose-500/20 text-rose-300 ring-rose-500/30" }
}

export function DocsCodeConsole({
  section,
  copiedId,
  onCopy,
}: {
  section: DocSection
  copiedId: string | null
  onCopy: (id: string, text: string) => void
}) {
  const [activeTabKey, setActiveTabKey] = useState<string>(
    section.subtabs?.[0]?.key || "cURL",
  )
  const [activeMode, setActiveMode] = useState<"request" | number>("request")

  useEffect(() => {
    setActiveMode("request")
    if (section.subtabs?.[0]?.key) {
      setActiveTabKey(section.subtabs[0].key)
    }
  }, [section.id])

  const subtabs = section.subtabs || []
  const activeSubtab = subtabs.find((t) => t.key === activeTabKey) || subtabs[0]
  const currentRequestCode = activeSubtab?.code || section.code || ""

  const responses = section.responses || [
    { status: 200, description: "Success", json: '{ "status": "ok" }' },
  ]
  const selectedResponse =
    typeof activeMode === "number"
      ? responses.find((r) => r.status === activeMode) || responses[0]!
      : responses[0]!

  const activeContent =
    activeMode === "request"
      ? currentRequestCode
      : selectedResponse.json || '{ "status": "ok" }'

  const activeLanguage =
    activeMode === "request" ? activeSubtab?.lang || "typescript" : "json"

  const copyKey = `${section.id}-${activeMode}-${activeTabKey}`

  return (
    <aside className="w-full xl:w-[480px] 2xl:w-[540px] shrink-0 xl:sticky xl:top-16 xl:h-[calc(100vh-64px)] xl:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:border-l border-black/[0.06] dark:border-white/[0.08] bg-[#0c0e14] text-white p-4 lg:p-6 space-y-4">
      {/* Header Mode & Status Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-white/[0.06] p-1 rounded-xl">
          <button
            onClick={() => setActiveMode("request")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all cursor-pointer ${
              activeMode === "request"
                ? "bg-white/20 text-white font-semibold shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Code2 className="h-4 w-4" />
            <span>Mã yêu cầu</span>
          </button>

          {responses.map((res) => {
            const meta = getStatusMeta(res.status)
            const isSelected = activeMode === res.status

            return (
              <button
                key={res.status}
                onClick={() => setActiveMode(res.status)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  isSelected
                    ? `${meta.pill} ring-1 font-semibold shadow-xs`
                    : "text-slate-400 hover:text-white hover:bg-white/5 font-medium"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    meta.is2xx ? "bg-emerald-400" : "bg-rose-400"
                  }`}
                />
                <span>
                  {res.status} {meta.short}
                </span>
              </button>
            )
          })}
        </div>

        {/* Copy Button */}
        <button
          onClick={() => onCopy(copyKey, activeContent)}
          className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/20 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
        >
          {copiedId === copyKey ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-300">Đã chép</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-300" />
              <span>Sao chép</span>
            </>
          )}
        </button>
      </div>

      {/* Sub-bar with smooth sliding animated active pill for language tabs */}
      {activeMode === "request" ? (
        subtabs.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            {subtabs.map((tab) => {
              const isActive = tab.key === activeTabKey
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTabKey(tab.key)}
                  className="relative px-3 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeLangIndicator"
                      className="absolute inset-0 bg-white/20 rounded-lg ring-1 ring-white/20 shadow-xs"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        )
      ) : (
        <div className="px-3.5 py-2 rounded-xl text-xs sm:text-sm leading-relaxed border bg-white/[0.04] border-white/10 text-slate-200">
          <span className="font-bold font-mono text-primary mr-1.5">
            {selectedResponse.status}
          </span>
          <span>{selectedResponse.description}</span>
        </div>
      )}

      {/* Full-height Code Display with Smooth Fade/Slide Animation */}
      <div className="rounded-2xl border border-white/10 bg-[#12141d] p-4 sm:p-5 font-mono shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs text-slate-400">
          <span className="flex items-center gap-2 font-mono">
            <Terminal className="h-4 w-4 text-primary" />
            {activeMode === "request"
              ? activeSubtab?.label || "cURL"
              : `JSON • STATUS ${selectedResponse.status}`}
          </span>
          <span className="text-emerald-400 text-xs font-semibold font-mono">
            ● Production Ready
          </span>
        </div>

        {/* Render full-height code with subtle entrance animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeMode}-${activeTabKey}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <DocsCodeHighlight
              code={activeContent}
              language={activeLanguage}
              showLineNumbers={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* External Tester Link */}
      <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/5">
        <span>Cần chạy thử trực tiếp?</span>
        <a
          href="https://id.vntez.cloud/developers"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-slate-300 hover:text-primary font-medium transition-colors"
        >
          <span>Mở VNTEZ Tester</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </aside>
  )
}
