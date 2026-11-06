"use client"

import React from "react"
import { motion } from "motion/react"
import { IconCheck, IconCloudUpload } from "@tabler/icons-react"

export function StorageDeepDive() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      {/* Left Column: Text & Features */}
      <div className="lg:col-span-6 space-y-6">
        <div className="text-xs font-mono font-bold tracking-wider text-[#fb291a] uppercase">
          LƯU TRỮ BIÊN // NVME CLUSTER
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Lưu trữ Edge tốc độ cao. <br />
          <span className="text-[#fb291a]">Hiệu năng thực, chi phí minh bạch.</span>
        </h2>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          Hạ tầng lưu trữ S3 nội địa với ổ NVMe Enterprise tại Hà Nội và TP.HCM. Khởi đầu miễn phí, nâng cấp gói linh hoạt theo dung lượng thực tế, không chi phí ẩn.
        </p>

        <div className="space-y-3.5 pt-1">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IconCheck className="size-3.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Upload đa phân mảnh (Multipart Upload)</h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Tải lên tệp dung lượng lớn ổn định, tự động phục hồi khi kết nối gián đoạn.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IconCheck className="size-3.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tốc độ NVMe nội địa (&lt; 15ms)</h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Tốc độ đọc/ghi vượt trội, tối ưu băng thông và tuân thủ lưu trữ dữ liệu trong nước.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IconCheck className="size-3.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tương thích 100% chuẩn AWS S3</h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Sử dụng ngay thư viện AWS SDK quen thuộc chỉ bằng cách thay đổi endpoint.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Unified Storage Monitor (Light Animated Surface) */}
      <div className="lg:col-span-6">
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e] shadow-sm overflow-hidden"
        >
          {/* Window title bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.06] bg-slate-50/60 dark:bg-[#090e18]">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-red-400/80" />
              <div className="size-3 rounded-full bg-amber-400/80" />
              <div className="size-3 rounded-full bg-emerald-400/80" />
              <span className="ml-2 font-mono text-xs text-slate-500 dark:text-slate-400">
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
                  <IconCloudUpload className="size-4 text-[#fb291a]" />
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    enterprise_catalog_assets.tar
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">48.2 GB • 90%</span>
              </div>

              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "90%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-[#fb291a] rounded-full"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span>Multipart: 18/20 parts song song</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Tốc độ: 420 MB/s • HAN-01 NVMe
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-black/[0.06] dark:border-white/[0.06]" />

            {/* Cost Predictability Comparison */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Dự báo ngân sách mở rộng</span>
                <span className="font-mono text-[11px] text-slate-400">Chi phí Egress & Dung lượng</span>
              </div>

              {/* AWS S3 Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Đám mây ngoại (AWS S3 thông thường)</span>
                  <span className="font-mono text-rose-500 font-semibold text-[11px]">Phí tải về leo thang không kiểm soát</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    whileInView={{ width: "88%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                    className="h-full bg-rose-500/70 rounded-md"
                  />
                </div>
              </div>

              {/* VNTEZ Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#fb291a]" />
                    vntez Edge Storage
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                    Gói cước cố định, nâng cấp linh hoạt
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    whileInView={{ width: "35%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="h-full bg-emerald-500 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seamless Bottom Telemetry Footer */}
          <div className="px-6 py-3 border-t border-black/[0.06] dark:border-white/[0.06] bg-slate-50/60 dark:bg-[#090e18] flex items-center justify-between text-[11px] font-mono text-slate-500">
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
