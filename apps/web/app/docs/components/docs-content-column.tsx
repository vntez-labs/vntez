"use client"

import React, { useState } from "react"
import { Copy, Check, Sparkles, FileText, Code2 } from "lucide-react"
import type { DocSection } from "../types"
import { generateMdx } from "../mdx-generator"
import { DocsContentParamsTable } from "./docs-content-params-table"
import { DocsContentResponses } from "./docs-content-responses"
import { DocsContentMdxView } from "./docs-content-mdx-view"

export function DocsContentColumn({
  section,
  copiedId,
  onCopy,
}: {
  section: DocSection
  copiedId: string | null
  onCopy: (id: string, text: string) => void
}) {
  const [viewFormat, setViewFormat] = useState<"spec" | "mdx">("spec")

  const method = section.endpoint?.method
  const path = section.endpoint?.path
  const mdxSource = generateMdx(section)

  return (
    <article className="flex-1 min-w-0 p-5 lg:p-7 xl:p-8 space-y-6">
      {/* Category, Badge & Format View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-primary">{section.category}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="rounded-md bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
            {section.badge}
          </span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
            OpenAPI 3.1
          </span>
        </div>

        {/* View Toggle: Specs vs MDX */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/[0.06] p-1 rounded-xl text-xs">
          <button
            onClick={() => setViewFormat("spec")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              viewFormat === "spec"
                ? "bg-white dark:bg-white/20 text-slate-900 dark:text-white font-semibold shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Đặc tả API</span>
          </button>
          <button
            onClick={() => setViewFormat("mdx")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              viewFormat === "mdx"
                ? "bg-white dark:bg-white/20 text-slate-900 dark:text-white font-semibold shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span>Mã nguồn MDX</span>
          </button>
        </div>
      </div>

      {viewFormat === "mdx" ? (
        <DocsContentMdxView
          section={section}
          mdxSource={mdxSource}
          copiedId={copiedId}
          onCopy={onCopy}
        />
      ) : (
        <>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {section.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {section.desc}
            </p>
          </div>

          {/* Flat Clean HTTP Endpoint Bar */}
          {path && method && (
            <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-black/[0.08] dark:border-white/[0.1]">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`px-2 py-0.5 rounded font-mono text-xs font-bold tracking-wider border ${
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
                <code className="font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white select-all break-all">
                  {path}
                </code>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onCopy(`${section.id}-endpoint`, path)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer shrink-0"
                >
                  {copiedId === `${section.id}-endpoint` ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Đã sao chép
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Sao chép URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onCopy(`${section.id}-mdx`, mdxSource)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer shrink-0"
                  title="Sao chép toàn bộ trang dạng MDX"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Chép MDX</span>
                </button>
              </div>
            </div>
          )}

          {/* Request Parameters Table */}
          {section.params && <DocsContentParamsTable params={section.params} />}

          {/* Flat Response Specifications */}
          <DocsContentResponses responses={section.responses} />

          {/* AI Prompt Integration Card */}
          {section.subtabs?.some(
            (t) => t.key === "aiPrompt" || t.key === "prompt",
          ) && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 text-xs sm:text-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Tích hợp 1 chạm bằng Cursor / Claude Code
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    Toàn bộ prompt định nghĩa mẫu sẵn sàng ở cột mã nguồn bên
                    phải.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </article>
  )
}
