"use client"

import React from "react"
import { motion } from "motion/react"
import { IconCloudUpload, IconServer } from "@tabler/icons-react"

export function StorageDeepDive() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      {/* Left Column: Text & Features */}
      <div className="lg:col-span-6 space-y-6">
        <div className="text-xs font-mono font-bold tracking-wider text-[#F03E2F] uppercase">
          LƯU TRỮ BIÊN // NVME CLUSTER
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1C1917] dark:text-white leading-[1.15] text-balance">
          Lưu trữ Edge tốc độ cao với <span className="text-[#F03E2F]">NVMe</span>.
        </h2>

        <p className="text-base sm:text-lg text-[#57534E] dark:text-stone-300 leading-relaxed font-sans text-balance">
          Hạ tầng lưu trữ tương thích AWS S3 chuẩn hóa, vận hành trực tiếp trên cụm ổ cứng NVMe Enterprise tại Hà Nội và TP.HCM. Tốc độ phản hồi cực nhanh, không phí tải về bất ngờ.
        </p>

        {/* 2 Compact Inline Stat Callouts */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white dark:bg-[#0c121e] border border-[#E7E5E4] dark:border-stone-800 shadow-[0_2px_8px_rgba(28,25,23,0.03)]">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1C1917] dark:text-white">
              &lt; 15ms
            </div>
            <div className="text-xs font-semibold text-[#1C1917] dark:text-stone-200 mt-1">
              Độ trễ nội địa
            </div>
            <div className="text-[11px] text-[#78716C] dark:text-stone-400 mt-0.5">
              NVMe cluster HAN-01 &amp; SGN-01
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0c121e] border border-[#E7E5E4] dark:border-stone-800 shadow-[0_2px_8px_rgba(28,25,23,0.03)]">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#F03E2F]">
              100%
            </div>
            <div className="text-xs font-semibold text-[#1C1917] dark:text-stone-200 mt-1">
              Tương thích S3 SDK
            </div>
            <div className="text-[11px] text-[#78716C] dark:text-stone-400 mt-0.5">
              Thay đổi endpoint, không đổi code
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Telemetry Card (No fake macOS traffic lights) */}
      <div className="lg:col-span-6">
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="rounded-2xl border border-[#E7E5E4] dark:border-stone-800 bg-white dark:bg-[#0c121e] shadow-[0_2px_12px_rgba(28,25,23,0.04)] overflow-hidden"
        >
          {/* Telemetry Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5E4] dark:border-stone-800 bg-[#FAF9F6] dark:bg-[#090e18]">
            <div className="flex items-center gap-2">
              <IconServer className="size-4 text-[#F03E2F]" />
              <span className="font-mono text-xs font-semibold text-[#1C1917] dark:text-stone-200">
                storage_telemetry.cluster
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>NVMe Enterprise Active</span>
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Live Multipart Transfer Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <IconCloudUpload className="size-4 text-[#F03E2F]" />
                  <span className="font-mono font-semibold text-[#1C1917] dark:text-white">
                    enterprise_catalog_assets.tar
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#78716C] dark:text-stone-400">
                  48.2 GB · 420 MB/s · HAN-01
                </span>
              </div>

              <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "90%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-[#F03E2F] rounded-full"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#78716C] dark:text-stone-400">
                <span>Multipart: 18/20 parts song song</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                  90% hoàn tất
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E7E5E4] dark:border-stone-800" />

            {/* Cost Predictability Comparison */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1C1917] dark:text-stone-200">
                  Dự báo ngân sách mở rộng
                </span>
                <span className="font-mono text-[11px] text-[#78716C] dark:text-stone-400">
                  Chi phí Egress
                </span>
              </div>

              {/* AWS S3 Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#57534E] dark:text-stone-400 truncate">
                    AWS S3 Egress
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 font-medium text-[11px] shrink-0">
                    Phí tải về leo thang
                  </span>
                </div>
                <div className="h-2.5 w-full bg-stone-100 dark:bg-stone-800 rounded-md overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    whileInView={{ width: "88%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-rose-500/70 rounded-md"
                  />
                </div>
              </div>

              {/* VNTEZ Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#1C1917] dark:text-white truncate flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#F03E2F]" />
                    vntez Edge Storage — Cố định, không phí tải về
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] shrink-0">
                    Chi phí ổn định
                  </span>
                </div>
                <div className="h-2.5 w-full bg-stone-100 dark:bg-stone-800 rounded-md overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    whileInView={{ width: "32%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                    className="h-full bg-emerald-500 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry Footer */}
          <div className="px-6 py-3 border-t border-[#E7E5E4] dark:border-stone-800 bg-[#FAF9F6] dark:bg-[#090e18] flex items-center justify-between text-[11px] font-mono text-[#78716C] dark:text-stone-400">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Tương thích 100% chuẩn AWS S3 API
            </span>
            <span>Độ trễ &lt; 15ms</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
