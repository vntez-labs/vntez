"use client"

import React from "react"
import { motion } from "motion/react"
import { IconCheck, IconShieldLock, IconKey, IconUsers, IconRefresh } from "@tabler/icons-react"

export function IdDeepDive() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      {/* Left Column: Clean RBAC & Session Card */}
      <div className="lg:col-span-6">
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="rounded-2xl border border-[#E7E5E4] dark:border-stone-800 bg-white dark:bg-[#0c121e] shadow-[0_2px_12px_rgba(28,25,23,0.04)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5E4] dark:border-stone-800 bg-[#FAF9F6] dark:bg-[#090e18]">
            <div className="flex items-center gap-2">
              <IconShieldLock className="size-4 text-[#F03E2F]" />
              <span className="font-mono text-xs font-semibold text-[#1C1917] dark:text-stone-200">
                iam_matrix.session
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-mono">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              OAuth 2.0 PKCE
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Authenticated User Identity */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-bold text-xs text-[#1C1917] dark:text-stone-200 border border-[#E7E5E4] dark:border-stone-700">
                  NA
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1C1917] dark:text-white flex items-center gap-1.5">
                    <span>nguyen.van.a@vntez.net</span>
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-xs text-[#78716C] dark:text-stone-400 font-mono">
                    ID: VNTEZ-ADM-8802 · Admin
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                Hoạt động
              </span>
            </div>

            {/* 3-Row Permission Matrix */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#1C1917] dark:text-stone-200 flex items-center justify-between">
                <span>Ma trận phân quyền (RBAC)</span>
                <span className="text-[11px] font-mono text-[#78716C] dark:text-stone-400">Trạng thái</span>
              </div>

              {/* Row 1: storage:read */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 text-xs font-mono">
                <span className="text-[#1C1917] dark:text-stone-200 font-medium">storage:read</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  <IconCheck className="size-3 text-emerald-500" />
                  Cho phép
                </span>
              </div>

              {/* Row 2: pos:sync */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 text-xs font-mono">
                <span className="text-[#1C1917] dark:text-stone-200 font-medium">pos:sync</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  <IconCheck className="size-3 text-emerald-500" />
                  Cho phép
                </span>
              </div>

              {/* Row 3: iam:admin */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 text-xs font-mono">
                <span className="text-[#1C1917] dark:text-stone-200 font-medium">iam:admin</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 dark:text-stone-400 bg-stone-200/60 dark:bg-stone-800 px-2 py-0.5 rounded">
                  <span className="font-bold">—</span>
                  Không cấp
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E7E5E4] dark:border-stone-800" />

            {/* Telemetry metadata */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-[#78716C] dark:text-stone-400">
                <span>Grant Type:</span>
                <span className="text-[#1C1917] dark:text-stone-200 font-semibold">authorization_code + PKCE</span>
              </div>
              <div className="flex items-center justify-between text-[#78716C] dark:text-stone-400">
                <span>Token Lifetime:</span>
                <span className="text-[#F03E2F] font-semibold">Short-lived JWT (15 phút)</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[#E7E5E4] dark:border-stone-800 bg-[#FAF9F6] dark:bg-[#090e18] flex items-center justify-between text-[11px] font-mono text-[#78716C] dark:text-stone-400">
            <span>Zero-Trust Architecture</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Mã hóa chuẩn RFC 7636</span>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Text & Features (Reversed Split) */}
      <div className="lg:col-span-6 space-y-6">
        <div className="text-xs font-mono font-bold tracking-wider text-[#F03E2F] uppercase">
          ĐỊNH DANH &amp; PHÂN QUYỀN // VNTEZ-IAM
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1C1917] dark:text-white leading-[1.15] text-balance">
          Hệ thống quản lý truy cập và <span className="text-[#F03E2F]">phân quyền</span>.
        </h2>

        <p className="text-base sm:text-lg text-[#57534E] dark:text-stone-300 leading-relaxed font-sans text-balance">
          Quản lý định danh người dùng tập trung, hỗ trợ Single Sign-On (SSO) và kiểm soát truy cập phân tầng (RBAC) với độ bảo mật cao nhất theo chuẩn RFC 7636.
        </p>

        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800 text-[#1C1917] dark:text-stone-200 border border-[#E7E5E4] dark:border-stone-700">
              <IconUsers className="size-4 text-[#F03E2F]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1C1917] dark:text-white">
                Ma trận phân quyền RBAC đa vai trò
              </h4>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-400 mt-0.5">
                Kiểm soát chính xác hành vi trên từng dịch vụ cho Admin, Developer và Operator.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800 text-[#1C1917] dark:text-stone-200 border border-[#E7E5E4] dark:border-stone-700">
              <IconKey className="size-4 text-[#F03E2F]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1C1917] dark:text-white">
                Single Sign-On (SSO) an toàn tuyệt đối
              </h4>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-400 mt-0.5">
                Xác thực một lần duy nhất qua chuẩn PKCE với Google, GitHub hoặc tài khoản nội bộ.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800 text-[#1C1917] dark:text-stone-200 border border-[#E7E5E4] dark:border-stone-700">
              <IconRefresh className="size-4 text-[#F03E2F]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1C1917] dark:text-white">
                Thu hồi phiên tức thì &amp; Token ngắn hạn
              </h4>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-stone-400 mt-0.5">
                Token ngắn hạn giảm thiểu rủi ro rò rỉ, cơ chế refresh token xoay vòng bảo mật.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
