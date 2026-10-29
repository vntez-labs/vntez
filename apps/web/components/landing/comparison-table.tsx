"use client"

import React from "react"
import {
  IconScale,
  IconCheck,
  IconX,
  IconMinus,
  IconSparkles,
} from "@tabler/icons-react"

interface ComparisonRow {
  criterion: string
  detail: string
  vntez: {
    text: string
    positive: boolean
    highlight?: boolean
  }
  cloudForeign: {
    text: string
    negative: boolean
  }
  traditional: {
    text: string
    neutral: boolean
  }
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    criterion: "Mô hình chi phí lưu trữ",
    detail: "Định giá dung lượng và băng thông tải dữ liệu",
    vntez: {
      text: "Gói cước linh hoạt, không chi phí ẩn",
      positive: true,
      highlight: true,
    },
    cloudForeign: {
      text: "Phí băng thông leo thang khó lường",
      negative: true,
    },
    traditional: {
      text: "Đầu tư phần cứng ban đầu lớn",
      neutral: true,
    },
  },
  {
    criterion: "Khả năng chạy Offline-First",
    detail: "Bán hàng và tạo đơn khi mất kết nối Internet",
    vntez: {
      text: "Tích hợp sẵn (SQLite + Tự đối soát)",
      positive: true,
      highlight: true,
    },
    cloudForeign: {
      text: "Phải tự viết giải pháp phức tạp",
      negative: true,
    },
    traditional: {
      text: "Hạn chế hoặc phụ thuộc mạng LAN",
      neutral: true,
    },
  },
  {
    criterion: "Tốc độ đọc/ghi & Độ trễ",
    detail: "Thời gian phản hồi và vị trí trung tâm dữ liệu",
    vntez: {
      text: "NVMe nội địa (<15ms, HAN & SGN)",
      positive: true,
      highlight: true,
    },
    cloudForeign: {
      text: "Hải ngoại / Region xa (>80ms)",
      negative: true,
    },
    traditional: {
      text: "Server vật lý tại cửa hàng",
      neutral: true,
    },
  },
  {
    criterion: "Xác thực (OAuth 2.0 & PKCE)",
    detail: "Đăng nhập Social một chạm và quản lý phiên an toàn",
    vntez: {
      text: "Hỗ trợ sẵn (Google, GitHub, JWT)",
      positive: true,
      highlight: true,
    },
    cloudForeign: {
      text: "Tính phí tăng theo MAU",
      negative: true,
    },
    traditional: {
      text: "Mật khẩu đơn giản / Không có",
      neutral: true,
    },
  },
]

export function ComparisonTable() {
  return (
    <section id="comparison" className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Tại sao chọn vntez?
        </h2>

        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          So sánh chi tiết vntez với các giải pháp đám mây ngoại quốc và phần mềm quản lý truyền thống trên thị trường.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c101a] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/[0.06] dark:border-white/[0.06] bg-slate-50/70 dark:bg-[#101524]">
                <th className="py-5 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 w-2/5">
                  Tiêu chí so sánh
                </th>
                <th className="py-5 px-6 text-sm font-bold text-[#fb291a] w-1/5 bg-[#fb291a]/5 border-x border-[#fb291a]/20">
                  <div className="flex items-center gap-1.5">
                    <span>vntez Platform</span>
                    <span className="rounded bg-[#fb291a] text-white text-[10px] px-1.5 py-0.2 font-mono font-normal">
                      Khuyên dùng
                    </span>
                  </div>
                </th>
                <th className="py-5 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 w-1/5">
                  Đám mây ngoại (AWS / Firebase)
                </th>
                <th className="py-5 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 w-1/5">
                  Phần mềm truyền thống
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.06] text-sm">
              {COMPARISON_DATA.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50/50 dark:hover:bg-[#121827] transition-colors"
                >
                  {/* Criterion details */}
                  <td className="py-5 px-6">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {row.criterion}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {row.detail}
                    </div>
                  </td>

                  {/* vntez column */}
                  <td className="py-5 px-6 font-semibold bg-[#fb291a]/5 border-x border-[#fb291a]/20 text-[#fb291a]">
                    <div className="flex items-center gap-2">
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#fb291a] text-white">
                        <IconCheck className="size-3 stroke-[3]" />
                      </div>
                      <span className="text-slate-900 dark:text-white font-bold">{row.vntez.text}</span>
                    </div>
                  </td>

                  {/* Foreign cloud column */}
                  <td className="py-5 px-6 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                        <IconX className="size-3 stroke-[2.5]" />
                      </div>
                      <span>{row.cloudForeign.text}</span>
                    </div>
                  </td>

                  {/* Traditional column */}
                  <td className="py-5 px-6 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
                        <IconMinus className="size-3" />
                      </div>
                      <span>{row.traditional.text}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
