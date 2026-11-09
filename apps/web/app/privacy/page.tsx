import type { Metadata } from "next"
import Link from "next/link"
import { IconShieldCheck } from "@tabler/icons-react"
import { fetchRootLegalDoc } from "@/lib/supabase-legal"
import { BlogMarkdownReader } from "../blog/[slug]/components/blog-markdown-reader"

export const metadata: Metadata = {
  title: "Chính sách bảo mật thông tin — vntez",
  description:
    "Cam kết bảo vệ dữ liệu cá nhân, quyền riêng tư và tuân thủ Luật An ninh mạng & Nghị định 13/2023/NĐ-CP của hệ sinh thái vntez.",
}

export default async function PrivacyPage() {
  const doc = await fetchRootLegalDoc(["privacy", "privacy-policy"])

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24 space-y-12">
      <div className="space-y-4 border-b border-black/[0.06] dark:border-white/[0.06] pb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <IconShieldCheck className="size-4" />
          <span>CHÍNH SÁCH BẢO MẬT & QUYỀN RIÊNG TƯ</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {doc?.title || "Chính sách Bảo vệ Dữ liệu & Quyền riêng tư"}
        </h1>

        <p className="text-sm text-slate-500 font-mono">
          Phiên bản {doc?.version || "2.5.0"} • Hiệu lực từ: {doc?.effectiveDate || "01/01/2026"} • Tuân thủ Nghị định 13/2023/NĐ-CP
        </p>
      </div>

      {doc?.content ? (
        <BlogMarkdownReader content={doc.content} />
      ) : (
        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300">
          <p>Dữ liệu đang được đồng bộ từ cơ sở dữ liệu chính...</p>
        </div>
      )}

      <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500">
        <Link href="/" className="text-[#fb291a] font-semibold hover:underline">
          ← Quay về trang chủ
        </Link>
        <Link href="/terms" className="hover:underline">
          Xem Điều khoản dịch vụ →
        </Link>
      </div>
    </div>
  )
}
