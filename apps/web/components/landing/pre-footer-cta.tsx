"use client"

import React from "react"
import Link from "next/link"
import { IconArrowRight, IconShieldCheck, IconMail } from "@tabler/icons-react"
import { buttonVariants } from "@workspace/ui/components/button"

export function PreFooterCta() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-28 sm:py-36 text-center">
      <div className="space-y-8">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Sẵn sàng hiện đại hóa hạ tầng vận hành của bạn?
        </h2>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto">
          Hợp nhất định danh OAuth 2.0, lưu trữ Edge tốc độ cao và giải pháp bán lẻ offline-first trên một nền tảng đồng nhất.
        </p>

        {/* Action Buttons using Shadcn Button Variants */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/products#vntez-id"
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "w-full sm:w-auto rounded-full px-8 py-3.5 text-base font-bold shadow-sm gap-2",
            })}
          >
            <span>Khởi tạo tài khoản vntez-id</span>
            <IconArrowRight className="size-4" />
          </Link>

          <a
            href="mailto:contact@vntez.net"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full sm:w-auto rounded-full px-8 py-3.5 text-base font-semibold gap-2",
            })}
          >
            <IconMail className="size-4" />
            <span>Liên hệ tư vấn tích hợp</span>
          </a>
        </div>

        {/* Guarantee line */}
        <div className="pt-2 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <IconShieldCheck className="size-4 text-emerald-500 shrink-0" />
          <span>Thiết lập chỉ 5 phút • Miễn phí gói khởi đầu • Nâng cấp linh hoạt theo quy mô</span>
        </div>
      </div>
    </section>
  )
}
