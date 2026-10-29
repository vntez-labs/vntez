import Link from "next/link"
import { VntezLogo } from "./vntez-logo"
import {
  IconShieldCheck,
  IconBrandGithub,
  IconBrandFacebook,
  IconArrowUpRight,
} from "@tabler/icons-react"

export function Footer() {
  return (
    <footer className="bg-slate-50/70 dark:bg-[#060a10] py-16 sm:py-20 text-slate-600 dark:text-slate-400 transition-colors duration-200 border-t border-black/[0.04] dark:border-white/[0.04]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Cột 1: Thương hiệu & Trạng thái */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <VntezLogo size={26} />
              <span className="font-display text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-[#fb291a] transition-colors">
                vntez
              </span>
            </Link>

            <p className="text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed font-sans text-sm">
              Hạ tầng lưu trữ Edge tốc độ cao, định danh bảo mật OAuth 2.0 PKCE và giải pháp bán lẻ offline-first tại Việt Nam.
            </p>

            {/* Trạng thái máy chủ (All systems operational) */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
              </span>
              <span>All systems operational</span>
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://github.com/hnamhocit"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub @hnamhocit"
                className="flex size-9 items-center justify-center rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e] text-slate-700 dark:text-slate-300 hover:text-[#fb291a] hover:border-[#fb291a]/40 transition-all"
              >
                <IconBrandGithub className="size-4.5" />
              </a>
              <a
                href="https://facebook.com/hnamhocit"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook @hnamhocit"
                className="flex size-9 items-center justify-center rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e] text-slate-700 dark:text-slate-300 hover:text-[#fb291a] hover:border-[#fb291a]/40 transition-all"
              >
                <IconBrandFacebook className="size-4.5" />
              </a>
            </div>
          </div>

          {/* Cột 2: Sản phẩm hệ sinh thái */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Sản phẩm
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/products#storage" className="hover:text-[#fb291a] transition-colors">
                  vntez Storage & Edge S3
                </Link>
              </li>
              <li>
                <Link href="/products#vntez-id" className="hover:text-[#fb291a] transition-colors">
                  vntez-id (OAuth 2.0 PKCE)
                </Link>
              </li>
              <li>
                <Link href="/products#bman-pos" className="hover:text-[#fb291a] transition-colors">
                  BMAN POS (Offline-First)
                </Link>
              </li>
              <li>
                <Link href="/products#supply-chain" className="hover:text-[#fb291a] transition-colors">
                  Fleet & Logistics WMS
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1 font-semibold text-[#fb291a] hover:underline pt-1 text-xs"
                >
                  <span>Xem tất cả sản phẩm</span>
                  <IconArrowUpRight className="size-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Tài nguyên & Lập trình viên */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Tài nguyên
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/docs" className="hover:text-[#fb291a] transition-colors">
                  Tài liệu kỹ thuật (Docs)
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#fb291a] transition-colors">
                  Bài viết & Kỹ thuật (Blog)
                </Link>
              </li>
              <li>
                <Link href="/docs#quickstart" className="hover:text-[#fb291a] transition-colors">
                  Hướng dẫn cài đặt SDK
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/hnamhocit"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#fb291a] transition-colors flex items-center gap-1.5"
                >
                  <span>GitHub @hnamhocit</span>
                  <IconArrowUpRight className="size-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/hnamhocit"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#fb291a] transition-colors flex items-center gap-1.5"
                >
                  <span>Facebook @hnamhocit</span>
                  <IconArrowUpRight className="size-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Chính sách & Pháp lý */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Chính sách
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/terms" className="hover:text-[#fb291a] transition-colors">
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#fb291a] transition-colors">
                  Chính sách bảo mật thông tin
                </Link>
              </li>
              <li>
                <Link href="/#philosophy" className="hover:text-[#fb291a] transition-colors">
                  Triết lý chủ quyền dữ liệu
                </Link>
              </li>
              <li>
                <a href="mailto:support@vntez.net" className="hover:text-[#fb291a] transition-colors">
                  Liên hệ kỹ thuật: support@vntez.net
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-14 pt-6 border-t border-black/[0.04] dark:border-white/[0.04] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>© 2026 vntez. Bản quyền thuộc về VNTEZ LABS • Phát triển bởi @hnamhocit.</div>
          <div className="flex items-center gap-4 font-mono text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <IconShieldCheck className="size-3.5 text-emerald-500" />
              Zero Vendor Lock-in
            </span>
            <span>•</span>
            <span>Chuẩn mở RFC 7636</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
