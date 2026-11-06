"use client"

import React from "react"
import { motion } from "motion/react"
import {
  IconCheck,
  IconWifiOff,
  IconCoffee,
  IconBread,
  IconPrinter,
} from "@tabler/icons-react"

export function PosDeepDive() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      {/* Left Column: Text & Features */}
      <div className="lg:col-span-6 space-y-6">
        <div className="text-xs font-mono font-bold tracking-wider text-[#fb291a] uppercase">
          BMAN POS & CHUỖI CUNG ỨNG // OFFLINE ENGINE
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Bán hàng liên tục khi rớt mạng. <br />
          <span className="text-[#fb291a]">Tự động đối soát khi online.</span>
        </h2>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          Máy thu ngân và nhân viên quét mã tiếp tục in hóa đơn và thanh toán bình thường kể cả khi mất mạng. Dữ liệu lưu an toàn trên SQLite và tự động đồng bộ khi có kết nối.
        </p>

        <div className="space-y-3.5 pt-1">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IconCheck className="size-3.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Bán hàng Offline 100% không độ trễ</h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Thao tác quét mã, thêm món và in bill qua mạng LAN chỉ mất 15ms.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IconCheck className="size-3.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tự động đối soát (Reconciliation)</h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Giải quyết xung đột dữ liệu tự động, cập nhật sổ sách ngay khi có mạng trở lại.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IconCheck className="size-3.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Khóa tồn kho nguyên tử</h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Tránh bán vượt tồn kho trong các chiến dịch bán hàng đa kênh có lượng truy cập lớn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Sleek Cashier Terminal Register */}
      <div className="lg:col-span-6">
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e] shadow-sm overflow-hidden"
        >
          {/* Terminal Topbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.06] bg-slate-50/60 dark:bg-[#090e18]">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                BMAN POS 3.4
              </span>
              <span className="text-[11px] text-slate-400">| Quầy 02 • Chi nhánh Cầu Giấy</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
              <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
              <IconWifiOff className="size-3.5" />
              <span>Wi-Fi ngắt • SQLite Engine</span>
            </div>
          </div>

          {/* Seamless Cashier Terminal Surface */}
          <div className="p-6 space-y-5">
            {/* Receipt Header Row */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-black/[0.06] dark:border-white/[0.06]">
              <span className="font-semibold text-slate-700 dark:text-slate-300">HÓA ĐƠN #POS-2026-9041</span>
              <span>14:32:05 • Bàn 06</span>
            </div>

            {/* Line Items */}
            <div className="space-y-3.5">
              {/* Item 1 */}
              <div className="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 p-1 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <IconCoffee className="size-4.5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Cà phê sữa đá Sài Gòn
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans">
                      Size L • 50% ngọt • Nhiều đá
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">× 2</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white">
                    70.000 ₫
                  </span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 p-1 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#fb291a]/10 text-[#fb291a] flex items-center justify-center">
                    <IconBread className="size-4.5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Bánh mì xíu mại trứng muối
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans">
                      Nóng giòn • Không cay
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">× 1</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white">
                    45.000 ₫
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-black/[0.06] dark:border-white/[0.06]" />

            {/* Total Calculation & Paid Status */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Tạm tính (Đã gồm 8% VAT)</span>
                <span className="font-mono">115.000 ₫</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  TỔNG THANH TOÁN
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-[#fb291a]">
                  115.000 ₫
                </span>
              </div>
            </div>

            {/* LAN Print Status Banner */}
            <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-700 dark:text-emerald-300">
              <div className="flex items-center gap-2 font-semibold">
                <IconCheck className="size-4 text-emerald-500 shrink-0" />
                <span>Đã thanh toán tiền mặt</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                <IconPrinter className="size-3.5" />
                <span>In bill LAN 12ms</span>
              </div>
            </div>
          </div>

          {/* Seamless Bottom Telemetry Dock */}
          <div className="px-6 py-3.5 border-t border-black/[0.06] dark:border-white/[0.06] bg-slate-50/70 dark:bg-[#070b14] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                Hàng đợi SQLite cục bộ: 18 đơn an toàn
              </span>
              <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                ACID Ready
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span>Tự động đối soát khi có mạng</span>
              <span className="text-slate-700 dark:text-slate-300">Reconciliation: TỰ ĐỘNG</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
