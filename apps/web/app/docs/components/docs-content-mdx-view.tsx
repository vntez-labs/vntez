"use client"

import React from "react"
import { Copy, Check, Download } from "lucide-react"
import type { DocSection } from "../types"
import { downloadMdxFile } from "../mdx-generator"
import { DocsCodeHighlight } from "./docs-code-highlight"

export function DocsContentMdxView({
  section,
  mdxSource,
  copiedId,
  onCopy,
}: {
  section: DocSection
  mdxSource: string
  copiedId: string | null
  onCopy: (id: string, text: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Mã nguồn MDX (Markdown + Metadata)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tương thích với Nextra, Mintlify, Docusaurus, Astro và Fumadocs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onCopy(`${section.id}-mdx`, mdxSource)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-primary transition-all cursor-pointer shadow-xs"
          >
            {copiedId === `${section.id}-mdx` ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Đã chép MDX</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Sao chép MDX</span>
              </>
            )}
          </button>

          <button
            onClick={() => downloadMdxFile(section)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-primary transition-all cursor-pointer shadow-xs"
            title="Tải về file .mdx"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Tải .mdx</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#12141d] p-4 text-white overflow-hidden shadow-sm">
        <DocsCodeHighlight
          code={mdxSource}
          language="markdown"
          showLineNumbers={true}
        />
      </div>
    </div>
  )
}
