"use client"

import React from "react"
import type { DocParam } from "../types"

export function DocsContentParamsTable({ params }: { params: DocParam[] }) {
  if (!params || params.length === 0) return null

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Tham số yêu cầu (Request Parameters)
      </h2>

      <div className="overflow-x-auto rounded-xl border border-black/[0.08] dark:border-white/[0.08]">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-black/[0.08] dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-slate-300 font-semibold">
              <th className="py-3 px-4">Tên tham số</th>
              <th className="py-3 px-4">Vị trí</th>
              <th className="py-3 px-4">Kiểu</th>
              <th className="py-3 px-4">Mô tả & Ví dụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.06] text-slate-700 dark:text-slate-300">
            {params.map((p, i) => (
              <tr
                key={i}
                className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                  {p.name}
                  {p.required && (
                    <span className="ml-1.5 text-[10px] font-semibold text-rose-500">
                      *bắt buộc
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <span className="rounded bg-slate-100 dark:bg-white/10 px-2 py-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {p.in}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                  {p.type}
                </td>
                <td className="py-3.5 px-4 leading-relaxed max-w-sm">
                  <p>{p.description}</p>
                  {p.example && (
                    <p className="mt-1 text-[11px] text-slate-400 font-mono">
                      Ví dụ:{" "}
                      <span className="text-slate-600 dark:text-slate-300">
                        {p.example}
                      </span>
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
