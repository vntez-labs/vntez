"use client"

import React from "react"
import type { DocResponse } from "../types"

function getResponseMeta(status: number) {
  const is2xx = status >= 200 && status < 300
  let label = is2xx ? "Thành công (OK)" : "Lỗi phản hồi"
  let color = is2xx ? "emerald" : "rose"

  switch (status) {
    case 200:
      label = "Thành công (OK)"
      color = "emerald"
      break
    case 201:
      label = "Đã tạo mới (Created)"
      color = "emerald"
      break
    case 204:
      label = "Không có nội dung (No Content)"
      color = "emerald"
      break
    case 400:
      label = "Lỗi yêu cầu (Bad Request)"
      color = "amber"
      break
    case 401:
      label = "Chưa xác thực (Unauthorized)"
      color = "orange"
      break
    case 403:
      label = "Không có quyền (Forbidden)"
      color = "rose"
      break
    case 404:
      label = "Không tìm thấy (Not Found)"
      color = "rose"
      break
    case 409:
      label = "Xung đột dữ liệu (Conflict)"
      color = "amber"
      break
    case 422:
      label = "Không thể xử lý (Unprocessable)"
      color = "amber"
      break
    case 429:
      label = "Vượt giới hạn tần suất (Rate Limited)"
      color = "orange"
      break
    case 500:
      label = "Lỗi máy chủ (Server Error)"
      color = "purple"
      break
  }

  const borderBg =
    color === "emerald"
      ? "border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10"
      : color === "amber"
        ? "border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10"
        : color === "orange"
          ? "border-orange-500/20 bg-orange-500/5 dark:bg-orange-500/10"
          : color === "purple"
            ? "border-purple-500/20 bg-purple-500/5 dark:bg-purple-500/10"
            : "border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10"

  const badgeBg =
    color === "emerald"
      ? "bg-emerald-500 text-white"
      : color === "amber"
        ? "bg-amber-500 text-white"
        : color === "orange"
          ? "bg-orange-500 text-white"
          : color === "purple"
            ? "bg-purple-500 text-white"
            : "bg-rose-500 text-white"

  return { label, borderBg, badgeBg }
}

export function DocsContentResponses({
  responses,
}: {
  responses?: DocResponse[]
}) {
  if (!responses || responses.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Phản hồi tiêu chuẩn (Response Specs)
        </h2>
        <span className="text-[11px] text-slate-400">
          Xem mẫu JSON chi tiết ở cột bên phải
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {responses.map((res, i) => {
          const { label, borderBg, badgeBg } = getResponseMeta(res.status)

          return (
            <div
              key={i}
              className={`rounded-xl p-3.5 sm:p-4 border transition-all text-xs sm:text-sm ${borderBg}`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${badgeBg}`}
                >
                  {res.status}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {label}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-[13px]">
                {res.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
