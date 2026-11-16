"use client"

import React from "react"
import Link from "next/link"
import { IconArrowRight, IconShieldCheck, IconMail } from "@tabler/icons-react"
import { buttonVariants } from "@workspace/ui/components/button"

export function PreFooterCta() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      <div className="relative overflow-hidden rounded-3xl border border-[#E7E5E4] dark:border-stone-800 bg-white dark:bg-[#0c121e] p-8 sm:p-14 shadow-[0_4px_24px_rgba(28,25,23,0.04)] text-center">
        {/* Subtle Warm Dot-Grid Background Accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(#D6D3D1_1px,transparent_1px)] dark:bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]"
        />

        <div className="relative z-10 space-y-7 max-w-2xl mx-auto">
          <div className="text-xs font-mono font-bold tracking-wider text-[#F03E2F] uppercase">
            BẮT ĐẦU NGAY HÔM NAY
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1C1917] dark:text-white leading-[1.18] text-balance">
            Sẵn sàng hiện đại hóa hạ tầng <span className="text-[#F03E2F]">vận hành</span> của bạn?
          </h2>

          <p className="text-base sm:text-lg text-[#57534E] dark:text-stone-300 leading-relaxed font-sans text-balance">
            Hợp nhất định danh &amp; phân quyền IAM, lưu trữ Edge tốc độ cao và giải pháp bán lẻ offline-first trên một nền tảng đồng nhất.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/products#vntez-iam"
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "w-full sm:w-auto rounded-full px-8 py-3.5 text-base font-bold shadow-sm gap-2",
              })}
            >
              <span>Khởi tạo tài khoản vntez-iam</span>
              <IconArrowRight className="size-4" />
            </Link>

            <a
              href="mailto:contact@vntez.net"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "w-full sm:w-auto rounded-full px-8 py-3.5 text-base font-semibold gap-2 border-[#E7E5E4] text-[#1C1917] dark:text-stone-200 dark:border-stone-800",
              })}
            >
              <IconMail className="size-4" />
              <span>Liên hệ tư vấn tích hợp</span>
            </a>
          </div>

          {/* Guarantee line */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs font-medium text-[#78716C] dark:text-stone-400">
            <IconShieldCheck className="size-4 text-emerald-500 shrink-0" />
            <span>Thiết lập chỉ 5 phút · Miễn phí gói khởi đầu · Nâng cấp linh hoạt theo quy mô</span>
          </div>
        </div>
      </div>
    </section>
  )
}
