"use client"

import React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  IconServer2,
  IconShieldCheck,
  IconRefresh,
  IconTruckDelivery,
  IconActivity,
  IconLayersLinked,
  IconArrowRight,
} from "@tabler/icons-react"
import {
  IsometricStorageArt,
  IsometricSecurityArt,
  IsometricOfflineArt,
  IsometricSupplyChainArt,
  IsometricTelemetryArt,
  IsometricEcosystemArt,
} from "./card-illustrations"

export function DuckDbGrid() {
  return (
    <section id="products" className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* ================================================================= */}
        {/* CARD 1: Edge Storage                                              */}
        {/* ================================================================= */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="group relative flex flex-col justify-between rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e]/80 p-6 shadow-sm hover:shadow-md hover:border-[#fb291a]/40 transition-all duration-200 overflow-hidden"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <IconServer2 className="size-7 shrink-0 text-[#fb291a]" strokeWidth={1.75} />
              <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#fb291a] transition-colors">
                Lưu trữ Edge tốc độ cao
              </h3>
            </div>
            <p className="max-w-[65%] text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Lưu trữ S3 nội địa tốc độ cao với NVMe. Gói cước minh bạch, nâng cấp linh hoạt không lo chi phí ẩn.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 top-12 w-[38%] pointer-events-none flex items-center justify-end pr-2 overflow-hidden opacity-85 dark:opacity-75">
            <IsometricStorageArt className="w-full h-full object-contain" />
          </div>

          <div className="relative z-10 pt-5 mt-auto">
            <Link
              href="/products#storage"
              className="inline-flex items-center gap-1.5 font-semibold text-xs text-[#fb291a] hover:underline"
            >
              <span>Tìm hiểu lưu trữ</span>
              <IconArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* CARD 2: OAuth 2.0, PKCE & Social Login                            */}
        {/* ================================================================= */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="group relative flex flex-col justify-between rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e]/80 p-6 shadow-sm hover:shadow-md hover:border-[#fb291a]/40 transition-all duration-200 overflow-hidden"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <IconShieldCheck className="size-7 shrink-0 text-[#fb291a]" strokeWidth={1.75} />
              <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#fb291a] transition-colors">
                Xác thực OAuth 2.0 & PKCE
              </h3>
            </div>
            <p className="max-w-[65%] text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Đăng nhập nhanh qua Google, GitHub hoặc tài khoản hệ sinh thái. Chuẩn bảo mật PKCE cho Web và Mobile.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 top-12 w-[38%] pointer-events-none flex items-center justify-end pr-2 overflow-hidden opacity-85 dark:opacity-75">
            <IsometricSecurityArt className="w-full h-full object-contain" />
          </div>

          <div className="relative z-10 pt-5 mt-auto">
            <Link
              href="/products#vntez-id"
              className="inline-flex items-center gap-1.5 font-semibold text-xs text-[#fb291a] hover:underline"
            >
              <span>Khám phá xác thực</span>
              <IconArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* CARD 3: Offline-First Resilience                                  */}
        {/* ================================================================= */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="group relative flex flex-col justify-between rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e]/80 p-6 shadow-sm hover:shadow-md hover:border-cyan-500/40 transition-all duration-200 overflow-hidden"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <IconRefresh className="size-7 shrink-0 text-cyan-500" strokeWidth={1.75} />
              <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                Vận hành Offline-First
              </h3>
            </div>
            <p className="max-w-[65%] text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Xử lý giao dịch trơn tru ngay cả khi mất Internet. Dữ liệu lưu cục bộ và tự động đồng bộ khi có kết nối trở lại.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 top-12 w-[38%] pointer-events-none flex items-center justify-end pr-2 overflow-hidden opacity-85 dark:opacity-75">
            <IsometricOfflineArt className="w-full h-full object-contain" />
          </div>

          <div className="relative z-10 pt-5 mt-auto">
            <Link
              href="/products#bman-pos"
              className="inline-flex items-center gap-1.5 font-semibold text-xs text-cyan-500 hover:underline"
            >
              <span>Kiến trúc Offline-First</span>
              <IconArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* CARD 4: Supply Chain & Fleet Routing                              */}
        {/* ================================================================= */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="group relative flex flex-col justify-between rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e]/80 p-6 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all duration-200 overflow-hidden"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <IconTruckDelivery className="size-7 shrink-0 text-emerald-500" strokeWidth={1.75} />
              <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                Điều phối chuỗi cung ứng
              </h3>
            </div>
            <p className="max-w-[65%] text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Tự động tối ưu vị trí kệ kho và vạch lộ trình giao hàng chặng cuối theo thời gian thực với sai số dưới 3 phút.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 top-12 w-[38%] pointer-events-none flex items-center justify-end pr-2 overflow-hidden opacity-85 dark:opacity-75">
            <IsometricSupplyChainArt className="w-full h-full object-contain" />
          </div>

          <div className="relative z-10 pt-5 mt-auto">
            <Link
              href="/products#supply-chain"
              className="inline-flex items-center gap-1.5 font-semibold text-xs text-emerald-500 hover:underline"
            >
              <span>Giải pháp kho vận</span>
              <IconArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* CARD 5: Telemetry & User Behavior                                 */}
        {/* ================================================================= */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="group relative flex flex-col justify-between rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e]/80 p-6 shadow-sm hover:shadow-md hover:border-[#f77241]/40 transition-all duration-200 overflow-hidden"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <IconActivity className="size-7 shrink-0 text-[#f77241]" strokeWidth={1.75} />
              <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#f77241] transition-colors">
                Giám sát & Trải nghiệm
              </h3>
            </div>
            <p className="max-w-[65%] text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Tự động bắt lỗi runtime trên thiết bị và phân tích phễu hành vi, phát hiện sự cố trước khi khách hàng phàn nàn.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 top-12 w-[38%] pointer-events-none flex items-center justify-end pr-2 overflow-hidden opacity-85 dark:opacity-75">
            <IsometricTelemetryArt className="w-full h-full object-contain" />
          </div>

          <div className="relative z-10 pt-5 mt-auto">
            <Link
              href="/products#telemetry"
              className="inline-flex items-center gap-1.5 font-semibold text-xs text-[#f77241] hover:underline"
            >
              <span>Khám phá giám sát</span>
              <IconArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* CARD 6: Unified Ecosystem & SDK Extensibility                    */}
        {/* ================================================================= */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="group relative flex flex-col justify-between rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e]/80 p-6 shadow-sm hover:shadow-md hover:border-purple-500/40 transition-all duration-200 overflow-hidden"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <IconLayersLinked className="size-7 shrink-0 text-purple-500" strokeWidth={1.75} />
              <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">
                Hệ sinh thái liên thông
              </h3>
            </div>
            <p className="max-w-[65%] text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Kết nối hạ tầng, bán lẻ và vận tải qua một giao diện duy nhất. Tích hợp nhanh qua SDK chính thức cho mọi nền tảng.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 top-12 w-[38%] pointer-events-none flex items-center justify-end pr-2 overflow-hidden opacity-85 dark:opacity-75">
            <IsometricEcosystemArt className="w-full h-full object-contain" />
          </div>

          <div className="relative z-10 pt-5 mt-auto">
            <Link
              href="/products#ecosystem"
              className="inline-flex items-center gap-1.5 font-semibold text-xs text-purple-500 hover:underline"
            >
              <span>Xem tài liệu SDK</span>
              <IconArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
