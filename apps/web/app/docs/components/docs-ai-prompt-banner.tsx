"use client"

import React from "react"
import Link from "next/link"
import { buttonVariants } from "@workspace/ui/components/button"
import { IconSparkles, IconCheck, IconCopy, IconExternalLink } from "@tabler/icons-react"
import { MASTER_AI_INTEGRATION_PROMPT } from "../docs-data"

interface DocsAiPromptBannerProps {
  copiedId: string | null
  onCopy: (id: string, text: string) => void
}

export function DocsAiPromptBanner({ copiedId, onCopy }: DocsAiPromptBannerProps) {
  return (
    <div className="rounded-2xl border border-[#fb291a]/30 bg-gradient-to-br from-[#fb291a]/[0.03] to-orange-500/[0.02] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#fb291a]">
          <IconSparkles className="size-4 shrink-0" />
          <span>Prompt AI Tích Hợp Một Chạm (Cursor / Claude Code)</span>
        </div>
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
          Cần tích hợp vntez-id vào dự án trong vài giây?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
          Copy prompt tổng thể này và dán trực tiếp vào Cursor Composer hoặc Claude để AI tự động cấu hình quy trình OAuth 2.0 PKCE, xử lý state và đổi token.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onCopy("master-prompt-banner", MASTER_AI_INTEGRATION_PROMPT)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#fb291a] hover:bg-[#e02012] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          {copiedId === "master-prompt-banner" ? (
            <>
              <IconCheck className="size-4" />
              <span>Đã copy Prompt!</span>
            </>
          ) : (
            <>
              <IconCopy className="size-4" />
              <span>Copy AI Prompt</span>
            </>
          )}
        </button>
        <Link
          href="https://vntez-id.vercel.app"
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "rounded-xl text-xs font-semibold gap-1.5",
          })}
        >
          <span>Mở cổng vntez-id</span>
          <IconExternalLink className="size-3.5 text-slate-400" />
        </Link>
      </div>
    </div>
  )
}
