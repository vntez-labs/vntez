"use client"

import React from "react"
import {
  IconCheck,
  IconX,
  IconMinus,
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
    criterion: "Định danh & Phân quyền IAM",
    detail: "Quản lý người dùng, phân quyền RBAC/ABAC và đăng nhập SSO",
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
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1C1917] dark:text-white leading-tight text-balance">
          Tại sao chọn <span className="text-[#F03E2F]">vntez</span>?
        </h2>

        <p className="mt-4 text-base sm:text-lg text-[#57534E] dark:text-stone-300 leading-relaxed font-sans text-balance">
          So sánh chi tiết vntez với các giải pháp đám mây ngoại quốc và phần mềm quản lý truyền thống trên thị trường.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-[#E7E5E4] dark:border-stone-800 bg-white dark:bg-[#0c101a] overflow-hidden shadow-[0_2px_12px_rgba(28,25,23,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E7E5E4] dark:border-white/[0.06] bg-[#FAF9F6] dark:bg-[#101524]">
                <th className="py-5 px-6 text-sm font-semibold text-[#1C1917] dark:text-stone-300 w-2/5">
                  Tiêu chí so sánh
                </th>
                <th className="py-5 px-6 text-sm font-bold text-[#F03E2F] w-1/5 bg-[#F03E2F]/5 border-x border-[#F03E2F]/20">
                  <div className="flex items-center gap-1.5">
                    <span>vntez Platform</span>
                    <span className="rounded bg-[#F03E2F] text-white text-[10px] px-1.5 py-0.2 font-mono font-normal">
                      Khuyên dùng
                    </span>
                  </div>
                </th>
                <th className="py-5 px-6 text-sm font-semibold text-[#1C1917] dark:text-stone-300 w-1/5">
                  Đám mây ngoại (AWS / Firebase)
                </th>
                <th className="py-5 px-6 text-sm font-semibold text-[#1C1917] dark:text-stone-300 w-1/5">
                  Phần mềm truyền thống
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E5E4] dark:divide-white/[0.06] text-sm">
              {COMPARISON_DATA.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-stone-50/60 dark:hover:bg-[#121827] transition-colors"
                >
                  {/* Criterion details */}
                  <td className="py-5 px-6">
                    <div className="font-bold text-[#1C1917] dark:text-white">
                      {row.criterion}
                    </div>
                    <div className="text-xs text-[#78716C] dark:text-stone-400 mt-0.5">
                      {row.detail}
                    </div>
                  </td>

                  {/* vntez column */}
                  <td className="py-5 px-6 font-semibold bg-[#F03E2F]/5 border-x border-[#F03E2F]/20 text-[#F03E2F]">
                    <div className="flex items-center gap-2">
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#F03E2F] text-white">
                        <IconCheck className="size-3 stroke-[3]" />
                      </div>
                      <span className="text-[#1C1917] dark:text-white font-bold">{row.vntez.text}</span>
                    </div>
                  </td>

                  {/* Foreign cloud column */}
                  <td className="py-5 px-6 text-[#57534E] dark:text-stone-400">
                    <div className="flex items-center gap-2">
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                        <IconX className="size-3 stroke-[2.5]" />
                      </div>
                      <span>{row.cloudForeign.text}</span>
                    </div>
                  </td>

                  {/* Traditional column */}
                  <td className="py-5 px-6 text-[#78716C] dark:text-stone-400">
                    <div className="flex items-center gap-2">
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-stone-200 dark:bg-stone-800 text-stone-500">
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
