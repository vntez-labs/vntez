"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  IconCode,
  IconCopy,
  IconCheck,
  IconBrandGithub,
  IconBook,
} from "@tabler/icons-react"
import { SNIPPETS, type LangTab } from "./dev-experience/snippets-data"

export function DeveloperExperience() {
  const [activeTab, setActiveTab] = useState<LangTab>("typescript")
  const [copied, setCopied] = useState(false)

  const currentSnippet = SNIPPETS[activeTab]

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.raw)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-28 sm:py-36 space-y-12">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
        <div className="space-y-4 max-w-2xl">
          <div className="text-xs font-mono font-bold tracking-wider text-[#F03E2F] uppercase">
            TRẢI NGHIỆM PHÁT TRIỂN // SDK &amp; API
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1C1917] dark:text-white leading-[1.15] text-balance">
            Đơn giản cho lập trình viên, mạnh mẽ cho <span className="text-[#F03E2F]">hệ thống</span>.
          </h2>

          <p className="text-base sm:text-lg text-[#57534E] dark:text-stone-300 leading-relaxed font-sans text-balance">
            Thư viện chính thức hỗ trợ TypeScript, C# (.NET 8) và REST API. Tương thích 100% chuẩn AWS S3 API và tích hợp sẵn giải pháp quản trị định danh &amp; phân quyền IAM.
          </p>
        </div>

        {/* Action Link to GitHub */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://github.com/hnamhocit"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E7E5E4] dark:border-stone-800 bg-white dark:bg-[#0c121e] px-4 py-2.5 text-xs font-semibold text-[#1C1917] dark:text-stone-200 hover:border-[#F03E2F]/40 hover:text-[#F03E2F] shadow-[0_1px_3px_rgba(28,25,23,0.03)] transition-all"
          >
            <IconBrandGithub className="size-4 text-stone-500" />
            <span>Mã nguồn mở SDK</span>
          </a>

          <a
            href={process.env.NEXT_PUBLIC_DOCS_URL || "https://vntez-docs.vercel.app"}
            className="inline-flex items-center gap-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 px-4 py-2.5 text-xs font-semibold text-[#1C1917] dark:text-stone-200 transition-colors"
          >
            <IconBook className="size-4 text-stone-500" />
            <span>Tài liệu API</span>
          </a>
        </div>
      </div>

      {/* Code Card Shell with dark charcoal background (#141413) */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#141413] shadow-sm overflow-hidden text-stone-200 font-mono">
        {/* Top bar with tabs & actions */}
        <div className="flex flex-wrap items-center justify-between border-b border-white/[0.06] bg-black/40 px-4 sm:px-6 py-3 gap-3">
          {/* Language selector tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {(Object.keys(SNIPPETS) as LangTab[]).map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "text-white"
                      : "text-stone-400 hover:text-stone-200 hover:bg-white/[0.04]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeLangTab"
                      className="absolute inset-0 rounded-lg bg-white/[0.1] border border-white/[0.12]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{SNIPPETS[tab].language}</span>
                </button>
              )
            })}
          </div>

          {/* Copy and Filename actions */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400 select-none hidden sm:inline">
              {currentSnippet.filename}
            </span>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] px-3 py-1.5 text-xs font-sans font-medium text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <IconCheck className="size-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Đã chép</span>
                </>
              ) : (
                <>
                  <IconCopy className="size-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content Surface */}
        <div className="p-6 sm:p-8 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto min-h-[190px]">
          <AnimatePresence mode="wait">
            <motion.pre
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="whitespace-pre font-mono"
            >
              {currentSnippet.highlighted}
            </motion.pre>
          </AnimatePresence>
        </div>

        {/* Micro-benchmarking footer with authentic metadata */}
        <div className="flex flex-wrap items-center justify-between border-t border-white/[0.06] bg-black/30 px-6 py-3 text-[11px] font-mono text-stone-400 gap-3">
          <div className="flex items-center gap-2">
            <IconCode className="size-3.5 text-[#F03E2F]" />
            <span>@vntez/sdk · TypeScript &amp; .NET 8 · MIT License</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span className="text-emerald-400 font-semibold">
              Kích thước: &lt; 8.4 KB (gzipped)
            </span>
            <span className="hidden sm:inline">·</span>
            <span>Tương thích chuẩn AWS S3</span>
          </div>
        </div>
      </div>
    </section>
  )
}
