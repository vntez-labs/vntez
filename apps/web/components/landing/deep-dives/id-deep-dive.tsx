"use client"

import React from "react"
import { motion } from "motion/react"
import {
  IconCheck,
  IconShieldLock,
  IconBrandGoogle,
  IconBrandGithub,
} from "@tabler/icons-react"

export function IdDeepDive() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      {/* Left Column: UI Mockup of OAuth 2.0 PKCE */}
      <div className="order-2 lg:order-1 lg:col-span-6">
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
                vntez_iam_matrix.session
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              <IconShieldLock className="size-3.5" />
              <span>IAM & RBAC Matrix</span>
            </div>
          </div>

          {/* Seamless Auth Surface */}
          <div className="p-6 space-y-6">
            {/* Authenticated User Identity */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200 border border-black/[0.06] dark:border-white/[0.06]">
                  NV
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>nguyen.van.a@vntez.net</span>
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    ID: VNTEZ-ADM-8802 • Quản trị viên
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <IconCheck className="size-3 text-emerald-500" />
                <span>Đã xác thực</span>
              </span>
            </div>

            {/* Social Login Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                whileHover={{ y: -1.5, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 py-2.5 px-3 text-xs font-semibold text-slate-800 dark:text-white cursor-pointer"
              >
                <IconBrandGoogle className="size-4 text-rose-500" />
                <span>Google Account</span>
              </motion.div>

              <motion.div
                whileHover={{ y: -1.5, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 py-2.5 px-3 text-xs font-semibold text-slate-800 dark:text-white cursor-pointer"
              >
                <IconBrandGithub className="size-4" />
                <span>GitHub SSO</span>
              </motion.div>
            </div>

            {/* Divider */}
            <div className="border-t border-black/[0.06] dark:border-white/[0.06]" />

            {/* PKCE Code Challenge Verification Telemetry */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-500">
                <span>Code Challenge:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">SHA-256 (S256 Verified)</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Grant Type:</span>
                <span className="text-slate-800 dark:text-slate-200">authorization_code + PKCE / RBAC</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Token Payload:</span>
                <span className="text-[#fb291a] font-semibold">Bearer JWT + Roles Scope (15m)</span>
              </div>
            </div>
          </div>

          {/* Seamless Bottom Dock */}
          <div className="px-6 py-3 border-t border-black/[0.06] dark:border-white/[0.06] bg-slate-50/60 dark:bg-[#090e18] flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Mã hóa đầu cuối Zero-Trust</span>
            <span className="text-emerald-600 dark:text-emerald-400">Zero Password Leak</span>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Text & Features */}
      <div className="order-1 lg:order-2 lg:col-span-6 space-y-6">
        <div className="text-xs font-mono font-bold tracking-wider text-[#fb291a] uppercase">
          ĐỊNH DANH & PHÂN QUYỀN // VNTEZ-IAM
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Hệ thống Quản lý Truy cập IAM. <br />
          <span className="text-[#fb291a]">Phân quyền ma trận RBAC & SSO bảo mật.</span>
        </h2>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          Hệ thống IAM toàn diện cho doanh nghiệp: Quản lý định danh người dùng tập trung, ma trận phân quyền chi tiết (Resources & Actions), Single Sign-On (SSO) và bảo vệ ứng dụng với mã hóa Zero-Trust.
        </p>

        <div className="space-y-3.5 pt-1">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IconCheck className="size-3.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Ma trận phân quyền RBAC & ABAC</h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Kiểm soát chi tiết quyền hạn theo Roles (Admin, Developer, Operator, Viewer) với từng tài nguyên và hành vi tương ứng.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IconCheck className="size-3.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Đăng nhập Social một chạm</h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Tận dụng tài khoản Google, GitHub quen thuộc, giảm rào cản đăng ký cho người dùng mới.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IconCheck className="size-3.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Token JWT ngắn hạn & Quản lý phiên</h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Tự động gia hạn qua refresh token an toàn và thu hồi quyền truy cập tức thì khi cần.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
