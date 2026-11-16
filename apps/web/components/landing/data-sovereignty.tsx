"use client"

import React from "react"
import {
  IconLockOpen,
  IconShieldLock,
  IconActivityHeartbeat,
  IconCheck,
} from "@tabler/icons-react"

export function DataSovereignty() {
  const commitments = [
    {
      title: "Chủ quyền dữ liệu (Zero Lock-in)",
      subtitle: "OPEN S3 STANDARD",
      desc: "Toàn bộ dữ liệu lưu theo chuẩn mở AWS S3. Doanh nghiệp tự do sao lưu, di chuyển hoặc tải về bất kỳ lúc nào mà không bị trói buộc hệ thống.",
      icon: IconLockOpen,
      metric: "Không trói buộc nhà cung cấp",
    },
    {
      title: "Cam kết SLA Uptime 99.9%",
      subtitle: "HIGH AVAILABILITY",
      desc: "Cụm máy chủ kép tại Hà Nội (HAN-01) và TP.HCM (SGN-01) với cơ chế tự động failover, đảm bảo tính sẵn sàng 24/7.",
      icon: IconActivityHeartbeat,
      metric: "Sẵn sàng vận hành 99.9%",
    },
    {
      title: "Định danh & Phân quyền IAM",
      subtitle: "IDENTITY & ACCESS MANAGEMENT",
      desc: "Kiểm soát truy cập toàn diện với ma trận phân quyền RBAC/ABAC, SSO và xác thực bảo mật chuẩn Enterprise.",
      icon: IconShieldLock,
      metric: "IAM, RBAC & SSO",
    },
  ]

  return (
    <section id="philosophy" className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1C1917] dark:text-white leading-tight text-balance">
          Dữ liệu của bạn. <span className="text-[#F03E2F]">Thuộc về bạn.</span>
        </h2>

        <p className="mt-4 text-base sm:text-lg text-[#57534E] dark:text-stone-300 leading-relaxed font-sans text-balance">
          Chúng tôi xây dựng vntez với nguyên tắc cốt lõi: Trao toàn quyền tự chủ cho doanh nghiệp, không tạo bẫy chi phí ẩn và không giữ chân khách hàng bằng các định dạng đóng.
        </p>
      </div>

      {/* 3 Commitment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {commitments.map((c, idx) => {
          const IconComp = c.icon
          return (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-[#E7E5E4] dark:border-stone-800 bg-white dark:bg-[#0c101a] p-7 hover:border-[#F03E2F]/30 transition-all shadow-[0_2px_12px_rgba(28,25,23,0.04)]"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#F03E2F]/10 text-[#F03E2F]">
                    <IconComp className="size-6" />
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-[#78716C] dark:text-stone-500 uppercase tracking-wider">
                    {c.subtitle}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-[#1C1917] dark:text-white mb-2.5">
                  {c.title}
                </h3>

                <p className="text-sm text-[#57534E] dark:text-stone-300 leading-relaxed font-sans">
                  {c.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E7E5E4] dark:border-white/[0.06] flex items-center gap-2 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                <IconCheck className="size-3.5" />
                <span>{c.metric}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
