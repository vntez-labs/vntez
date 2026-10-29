"use client"

import React from "react"
import { motion } from "motion/react"
import {
  IconServer2,
  IconBrandGoogle,
  IconBrandGithub,
  IconShieldLock,
  IconWifiOff,
  IconCheck,
  IconCloudUpload,
  IconCoffee,
  IconBread,
  IconDatabase,
  IconPrinter,
} from "@tabler/icons-react"

export function ProductDeepDives() {
  return (
    <section id="products" className="mx-auto max-w-6xl px-6 py-28 sm:py-36 space-y-36 sm:space-y-48">
      {/* ========================================================================= */}
      {/* BLOCK 1: VNTEZ STORAGE & EDGE (NVME CLUSTER)                              */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* BLOCK 2: OAUTH 2.0, PKCE & SOCIAL LOGIN (ZAG)                             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: UI Mockup of OAuth 2.0 PKCE (Light Animated Surface) */}
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
                  oauth2_pkce_auth.session
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                <IconShieldLock className="size-3.5" />
                <span>RFC 7636 PKCE</span>
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
                  <span className="text-slate-800 dark:text-slate-200">authorization_code + PKCE</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Token Payload:</span>
                  <span className="text-[#fb291a] font-semibold">Bearer JWT (Stateless, 15 phút)</span>
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
            ĐỊNH DANH & XÁC THỰC // OAUTH 2.0 & PKCE
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Đăng nhập Social & OAuth 2.0. <br />
            <span className="text-[#fb291a]">Bảo mật chuẩn PKCE cho Web & Mobile.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            Đăng nhập nhanh chóng qua Google, GitHub hoặc tài khoản hệ sinh thái. Chuẩn bảo mật PKCE và token JWT ngắn hạn giúp bảo vệ toàn diện ứng dụng di động và web của bạn.
          </p>

          <div className="space-y-3.5 pt-1">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <IconCheck className="size-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Chuẩn PKCE (RFC 7636)</h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Bảo vệ mã ủy quyền chống lại việc bị ứng dụng độc hại đánh chặn trên thiết bị di động.
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

      {/* ========================================================================= */}
      {/* BLOCK 3: BMAN POS & OFFLINE ENGINE (LIGHT ANIMATED REGISTER)              */}
      {/* ========================================================================= */}
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

        {/* Right Column: Sleek Cashier Terminal Register (Light Animated Surface) */}
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

              {/* Line Items (Clean Food/Drink Rows, No Nested Cards) */}
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

            {/* Seamless Bottom Telemetry Dock (SQLite WAL Engine) */}
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
    </section>
  )
}
