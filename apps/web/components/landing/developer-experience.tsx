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
          <div className="text-xs font-mono font-bold tracking-wider text-[#fb291a] uppercase">
            TRẢI NGHIỆM PHÁT TRIỂN // SDK & API
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Đơn giản cho lập trình viên. <br />
            <span className="text-[#fb291a]">Mạnh mẽ cho hệ thống lớn.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            Thư viện chính thức cho Node, C# (.NET) và Python. Tương thích 100% chuẩn AWS S3 API và tích hợp quy trình OAuth 2.0 PKCE chuẩn bảo mật.
          </p>
        </div>

        {/* Action Link to GitHub */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://github.com/hnamhocit"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e] px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-[#fb291a]/40 hover:text-[#fb291a] transition-all shadow-xs"
          >
            <IconBrandGithub className="size-4 text-slate-500" />
            <span>Mã nguồn mở SDK</span>
          </a>

          <a
            href="/docs"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100/90 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <IconBook className="size-4 text-slate-500" />
            <span>Tài liệu API</span>
          </a>
        </div>
      </div>

      {/* Code Card Shell */}
      <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[#070b14] shadow-sm overflow-hidden text-slate-200 font-mono">
        {/* Top bar with tabs & actions */}
        <div className="flex flex-wrap items-center justify-between border-b border-white/[0.06] bg-black/40 px-4 sm:px-6 py-3 gap-3">
          {/* Language selector tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {(Object.keys(SNIPPETS) as LangTab[]).map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeLangTab"
                      className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.1]"
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
            <span className="text-xs text-slate-400 select-none hidden sm:inline">
              {currentSnippet.filename}
            </span>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] px-3 py-1.5 text-xs font-sans font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
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

        {/* Micro-benchmarking footer */}
        <div className="flex flex-wrap items-center justify-between border-t border-white/[0.06] bg-black/30 px-6 py-3 text-[11px] font-mono text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <IconCode className="size-3.5 text-[#fb291a]" />
            <span>Type Definition: Hoàn chỉnh 100% TypeScript & C#</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-semibold">
              Kích thước Bundle: &lt; 8.4 KB (gzipped)
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="text-slate-400">Zero C/C++ dependencies</span>
          </div>
        </div>
      </div>
    </section>
  )
}
