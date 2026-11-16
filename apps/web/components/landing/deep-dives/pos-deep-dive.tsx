"use client"

import React from "react"
import { motion } from "motion/react"
import {
  IconCheck,
  IconWifiOff,
  IconCoffee,
  IconBread,
  IconPrinter,
  IconDatabase,
  IconArrowsExchange,
} from "@tabler/icons-react"

export function PosDeepDive() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      {/* Left Column: Text & Features */}
      <div className="lg:col-span-6 space-y-6">
        <div className="text-xs font-mono font-bold tracking-wider text-[#F03E2F] uppercase">
          BMAN POS // OFFLINE ENGINE
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1C1917] dark:text-white leading-[1.15] text-balance">
          Bán hàng liên tục không lo <span className="text-[#F03E2F]">rớt mạng</span>.
        </h2>

        <p className="text-base sm:text-lg text-[#57534E] dark:text-stone-300 leading-relaxed font-sans text-balance">
          Giải pháp điểm bán lẻ offline-first giúp thu ngân in hóa đơn tức thì qua mạng LAN và ghi nhận giao dịch vào cơ sở dữ liệu SQLite cục bộ mà không phụ thuộc đường truyền internet.
        </p>

        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800 text-[#1C1917] dark:text-stone-200 border border-[#E7E5E4] dark:border-stone-700">
              <IconPrinter className="size-4 text-[#F03E2F]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1C1917] dark:text-white">
                In hóa đơn qua mạng LAN chỉ 15ms
              </h4>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-400 mt-0.5">
                Giao thức ESC/POS trực tiếp tới máy in trong mạng nội bộ, loại bỏ độ trễ điện toán đám mây.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800 text-[#1C1917] dark:text-stone-200 border border-[#E7E5E4] dark:border-stone-700">
              <IconDatabase className="size-4 text-[#F03E2F]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1C1917] dark:text-white">
                Cơ sở dữ liệu SQLite cục bộ chuẩn ACID
              </h4>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-400 mt-0.5">
                Toàn bộ đơn hàng được ghi nhận an toàn tại quầy, sẵn sàng hoạt động ngay cả khi ngắt kết nối mạng hoàn toàn.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800 text-[#1C1917] dark:text-stone-200 border border-[#E7E5E4] dark:border-stone-700">
              <IconArrowsExchange className="size-4 text-[#F03E2F]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1C1917] dark:text-white">
                Tự động đối soát và hòa giải xung đột
              </h4>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-400 mt-0.5">
                Khi có kết nối internet trở lại, hệ thống tự động đẩy hàng đợi và đối soát số liệu với máy chủ trung tâm.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Warm Retail Receipt + Sync Queue Card */}
      <div className="lg:col-span-6">
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="rounded-2xl border border-[#E7E5E4] dark:border-stone-800 bg-white dark:bg-[#0c121e] shadow-[0_2px_12px_rgba(28,25,23,0.04)] overflow-hidden"
        >
          {/* Topbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5E4] dark:border-stone-800 bg-[#FAF9F6] dark:bg-[#090e18]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#1C1917] dark:text-white">
                BMAN POS 3.4
              </span>
              <span className="text-[11px] text-[#78716C] dark:text-stone-400">
                · Quầy 02
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              <IconWifiOff className="size-3.5" />
              <span>Offline · SQLite cục bộ</span>
            </div>
          </div>

          {/* Receipt Body */}
          <div className="p-6 space-y-5">
            {/* Receipt Header */}
            <div className="flex items-center justify-between text-xs font-mono text-[#78716C] dark:text-stone-400 pb-2 border-b border-[#E7E5E4] dark:border-stone-800">
              <span className="font-semibold text-[#1C1917] dark:text-stone-200">HÓA ĐƠN #POS-2026-9041</span>
              <span>14:32:05 · Bàn 06</span>
            </div>

            {/* Line Items */}
            <div className="space-y-3">
              {/* Item 1 */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                    <IconCoffee className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-[#1C1917] dark:text-white">
                      Cà phê sữa đá Sài Gòn
                    </div>
                    <div className="text-[11px] text-[#78716C] dark:text-stone-400">
                      Size L · Nhiều đá
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#78716C] dark:text-stone-400">× 2</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-[#1C1917] dark:text-white">
                    70.000 ₫
                  </span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-[#F03E2F]/10 text-[#F03E2F] flex items-center justify-center">
                    <IconBread className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-[#1C1917] dark:text-white">
                      Bánh mì xíu mại
                    </div>
                    <div className="text-[11px] text-[#78716C] dark:text-stone-400">
                      Nóng giòn
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#78716C] dark:text-stone-400">× 1</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-[#1C1917] dark:text-white">
                    45.000 ₫
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E7E5E4] dark:border-stone-800" />

            {/* Total Calculation */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs text-[#78716C] dark:text-stone-400">
                <span>Tạm tính (Đã gồm 8% VAT)</span>
                <span className="font-mono">115.000 ₫</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs sm:text-sm font-bold text-[#1C1917] dark:text-white">
                  TỔNG CỘNG
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-[#F03E2F]">
                  115.000 ₫
                </span>
              </div>
            </div>

            {/* Print Confirmation */}
            <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-800 dark:text-emerald-300">
              <div className="flex items-center gap-1.5 font-medium">
                <IconCheck className="size-4 text-emerald-600" />
                <span>Đã in bill LAN (15ms)</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
                Đã lưu SQLite
              </span>
            </div>
          </div>

          {/* Single Clean Footer Status Bar */}
          <div className="px-6 py-3 border-t border-[#E7E5E4] dark:border-stone-800 bg-[#FAF9F6] dark:bg-[#090e18] flex items-center justify-between text-[11px] font-mono text-[#78716C] dark:text-stone-400">
            <span className="flex items-center gap-2 font-medium text-[#1C1917] dark:text-stone-200">
              <span className="size-2 rounded-full bg-emerald-500" />
              18 đơn chờ đồng bộ · Tự động đẩy khi có mạng
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              ACID Safe
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
