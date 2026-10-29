"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { IconCheck } from "@tabler/icons-react"

interface FlowStep {
  id: string
  title: string
  role: string
  desc: string
  metric: string
  color: string
  bgSoft: string
  borderSoft: string
}

const FLOW_STEPS: FlowStep[] = [
  {
    id: "id",
    title: "1. Định danh & Cấp quyền (vntez-id)",
    role: "OAUTH 2.0 & PKCE AUTH",
    desc: "Đăng nhập nhanh qua Google, GitHub hoặc tài khoản hệ sinh thái, cấp JWT ngắn hạn an toàn.",
    metric: "Chuẩn PKCE (RFC 7636) • Token JWT",
    color: "#fb291a",
    bgSoft: "bg-[#fb291a]/10",
    borderSoft: "border-[#fb291a]/30",
  },
  {
    id: "pos",
    title: "2. Thu ngân & Thiết bị bán lẻ",
    role: "OFFLINE-FIRST CLIENT",
    desc: "Bán hàng và in bill tức thời trên SQLite cục bộ, không lo rớt mạng hay gián đoạn.",
    metric: "Offline 100% • Tự động đối soát",
    color: "#06b6d4",
    bgSoft: "bg-cyan-500/10",
    borderSoft: "border-cyan-500/30",
  },
  {
    id: "storage",
    title: "3. Đồng bộ Lưu trữ biên (Edge S3)",
    role: "EDGE S3 HIGH PERFORMANCE",
    desc: "Đồng bộ hóa đơn và tệp dữ liệu lên cụm máy chủ nội địa tại Hà Nội và TP.HCM với tốc độ cao.",
    metric: "Độ trễ < 15ms • Tương thích AWS S3",
    color: "#fb291a",
    bgSoft: "bg-[#fb291a]/10",
    borderSoft: "border-[#fb291a]/30",
  },
  {
    id: "telemetry",
    title: "4. Giám sát sự cố tự động (Telemetry)",
    role: "REAL-TIME OBSERVABILITY",
    desc: "Bắt lỗi runtime tự động và phân tích sự cố trên thiết bị trước khi khách hàng báo cáo.",
    metric: "Báo lỗi tức thời • SDK < 8KB",
    color: "#f77241",
    bgSoft: "bg-[#f77241]/10",
    borderSoft: "border-[#f77241]/30",
  },
  {
    id: "logistics",
    title: "5. Điều phối kho bãi & Tuyến giao (WMS)",
    role: "SUPPLY CHAIN DISPATCH",
    desc: "Tự động sắp xếp vị trí kho bãi và tối ưu hóa tuyến đường giao hàng chặng cuối cho tài xế.",
    metric: "Dự báo ETA ±2 phút • Tối ưu 30% lộ trình",
    color: "#10b981",
    bgSoft: "bg-emerald-500/10",
    borderSoft: "border-emerald-500/30",
  },
]

export function ArchitectureFlow() {
  const [activeStep, setActiveStep] = useState<string>("id")
  const current = FLOW_STEPS.find((s) => s.id === activeStep) ?? FLOW_STEPS[0]!

  return (
    <section id="architecture" className="mx-auto max-w-6xl px-6 py-28 sm:py-32">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Tất cả kết nối với nhau thế nào?
        </h2>

        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          Không phải là tập hợp rời rạc của các công cụ riêng biệt. vntez vận hành như một hệ điều hành thống nhất với luồng luân chuyển dữ liệu khép kín.
        </p>
      </div>

      {/* Flow Stepper Buttons - Seamless Segmented Control without Border Jitter */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
        {FLOW_STEPS.map((step, idx) => {
          const isActive = step.id === activeStep
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`relative flex flex-col text-left p-3.5 sm:p-4 rounded-xl transition-all overflow-hidden cursor-pointer ${
                isActive
                  ? "shadow-sm"
                  : "bg-slate-100/70 dark:bg-[#0c101a] hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeStepBackground"
                  className="absolute inset-0 rounded-xl"
                  style={{ backgroundColor: step.color }}
                  initial={false}
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  isActive ? "text-white/85" : "text-slate-400 dark:text-slate-500"
                }`}
              >
                Bước 0{idx + 1}
              </span>
              <span
                className={`relative z-10 font-display text-xs sm:text-sm font-bold mt-1.5 line-clamp-1 transition-colors ${
                  isActive ? "text-white" : "text-slate-900 dark:text-white"
                }`}
              >
                {step.title.split(". ")[1]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Dynamic Graphic Pipeline View - Borderless Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Animated Step Details */}
        <div className="lg:col-span-5 flex flex-col justify-between min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div
                className="text-xs font-mono font-bold uppercase tracking-wider mb-2.5"
                style={{ color: current.color }}
              >
                {current.role}
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                {current.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans mb-6">
                {current.desc}
              </p>

              <div className="flex items-center gap-2 text-xs font-mono font-semibold" style={{ color: current.color }}>
                <IconCheck className="size-4 shrink-0" />
                <span>{current.metric}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="mt-8 text-xs text-slate-400 dark:text-slate-500 font-sans">
            Nhấn vào từng bước ở trên hoặc trực tiếp trên sơ đồ để theo dõi luồng luân chuyển dữ liệu.
          </p>
        </div>

        {/* Right: Architecture Visual with Sleek Bezier Circuit Bus */}
        <div className="lg:col-span-7 flex items-center justify-center rounded-2xl bg-slate-50/50 dark:bg-[#0c101a] p-4 sm:p-6 min-h-[300px]">
          <svg viewBox="0 0 540 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto select-none">
            <defs>
              {/* Radial gradient for Center Hub */}
              <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fb291a" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#fb291a" stopOpacity="0" />
              </radialGradient>

              {/* Direct Sync Gradient */}
              <linearGradient id="topArchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#fb291a" />
                <stop offset="100%" stopColor="#fb291a" />
              </linearGradient>

              {/* Telemetry to Fleet Gradient */}
              <linearGradient id="bottomArchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f77241" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* ============================================================= */}
            {/* 1. CURVED INTERCONNECTION PIPELINES                           */}
            {/* ============================================================= */}

            {/* Top Direct Edge Replication Bus (POS -> S3) */}
            <path
              id="topArchPath"
              d="M 172 45 C 240 10, 300 10, 368 45"
              fill="none"
              stroke="url(#topArchGrad)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="opacity-40 dark:opacity-50"
            />

            {/* Bottom Telemetry Fleet Telemetry Bus */}
            <path
              id="bottomArchPath"
              d="M 172 255 C 240 290, 300 290, 368 255"
              fill="none"
              stroke="url(#bottomArchGrad)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="opacity-40 dark:opacity-50"
            />

            {/* Curve 1: POS -> Hub (Top-Left) */}
            <path
              id="pathPosToHub"
              d="M 172 59 C 220 59, 215 150, 230 150"
              fill="none"
              stroke="#06b6d4"
              strokeWidth={activeStep === "pos" ? "2.5" : "1.5"}
              strokeOpacity={activeStep === "pos" ? 1 : 0.3}
              className="transition-all duration-300"
            />

            {/* Curve 2: Hub -> Storage (Top-Right) */}
            <path
              id="pathHubToStorage"
              d="M 310 150 C 325 150, 320 59, 368 59"
              fill="none"
              stroke="#fb291a"
              strokeWidth={activeStep === "storage" ? "2.5" : "1.5"}
              strokeOpacity={activeStep === "storage" ? 1 : 0.3}
              className="transition-all duration-300"
            />

            {/* Curve 3: Hub -> Telemetry (Bottom-Left) */}
            <path
              id="pathHubToTelemetry"
              d="M 230 150 C 215 150, 220 241, 172 241"
              fill="none"
              stroke="#f77241"
              strokeWidth={activeStep === "telemetry" ? "2.5" : "1.5"}
              strokeOpacity={activeStep === "telemetry" ? 1 : 0.3}
              className="transition-all duration-300"
            />

            {/* Curve 4: Hub -> Fleet (Bottom-Right) */}
            <path
              id="pathHubToFleet"
              d="M 310 150 C 325 150, 320 241, 368 241"
              fill="none"
              stroke="#10b981"
              strokeWidth={activeStep === "logistics" ? "2.5" : "1.5"}
              strokeOpacity={activeStep === "logistics" ? 1 : 0.3}
              className="transition-all duration-300"
            />

            {/* ============================================================= */}
            {/* 2. FLOWING DATA PARTICLES                                     */}
            {/* ============================================================= */}

            {/* Particle on POS Path */}
            <circle r={activeStep === "pos" ? "4.5" : "3"} fill="#06b6d4">
              <animateMotion dur="2.4s" repeatCount="indefinite">
                <mpath href="#pathPosToHub" />
              </animateMotion>
            </circle>

            {/* Particle on Storage Path */}
            <circle r={activeStep === "storage" ? "4.5" : "3"} fill="#fb291a">
              <animateMotion dur="2.2s" repeatCount="indefinite">
                <mpath href="#pathHubToStorage" />
              </animateMotion>
            </circle>

            {/* Particle on Telemetry Path */}
            <circle r={activeStep === "telemetry" ? "4.5" : "3"} fill="#f77241">
              <animateMotion dur="2.6s" repeatCount="indefinite">
                <mpath href="#pathHubToTelemetry" />
              </animateMotion>
            </circle>

            {/* Particle on Fleet Path */}
            <circle r={activeStep === "logistics" ? "4.5" : "3"} fill="#10b981">
              <animateMotion dur="2.5s" repeatCount="indefinite">
                <mpath href="#pathHubToFleet" />
              </animateMotion>
            </circle>

            {/* ============================================================= */}
            {/* 3. CENTER ENGINE: VNTEZ-ID GATEWAY                            */}
            {/* ============================================================= */}
            <g
              transform="translate(270, 150)"
              onClick={() => setActiveStep("id")}
              className="cursor-pointer"
            >
              {/* Outer Glow */}
              <circle cx="0" cy="0" r="54" fill="url(#hubGlow)" />

              {/* Orbital Ring */}
              <circle
                cx="0"
                cy="0"
                r="46"
                fill="none"
                stroke="#fb291a"
                strokeWidth={activeStep === "id" ? "1.75" : "1"}
                strokeDasharray="4 4"
                className="opacity-50"
              />

              {/* Center Body */}
              <circle
                cx="0"
                cy="0"
                r="38"
                className="fill-white dark:fill-[#121827] stroke-[#fb291a] transition-all duration-300"
                strokeWidth={activeStep === "id" ? "2.5" : "1.5"}
              />
              <circle cx="0" cy="0" r="30" fill="#fb291a" fillOpacity={activeStep === "id" ? "0.15" : "0.08"} />

              {/* Text */}
              <text x="0" y="-3" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="bold" className="fill-slate-900 dark:fill-white">
                vntez-id
              </text>
              <text x="0" y="10" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="#fb291a" fontWeight="bold">
                ZERO-TRUST
              </text>
              <text x="0" y="21" textAnchor="middle" fontFamily="monospace" fontSize="6.5" className="fill-slate-400">
                OAUTH 2.0 PKCE
              </text>
            </g>

            {/* ============================================================= */}
            {/* 4. FOUR SERVICE NODES (MODERN ARCHITECTURAL CARDS)           */}
            {/* ============================================================= */}

            {/* Node 1: POS Terminal (Top Left) */}
            <g
              transform="translate(24, 30)"
              onClick={() => setActiveStep("pos")}
              className="cursor-pointer"
            >
              <rect
                x="0"
                y="0"
                width="148"
                height="58"
                rx="12"
                className="fill-white dark:fill-[#121827] transition-all duration-300"
                stroke={activeStep === "pos" ? "#06b6d4" : "currentColor"}
                strokeWidth={activeStep === "pos" ? "2" : "1"}
                strokeOpacity={activeStep === "pos" ? 1 : 0.12}
              />
              <circle cx="20" cy="29" r="5" fill="#06b6d4" />
              <text x="34" y="25" fontFamily="sans-serif" fontSize="11" fontWeight="bold" className="fill-slate-900 dark:fill-white">
                Thiết bị POS
              </text>
              <text x="34" y="41" fontFamily="monospace" fontSize="8.5" fill="#06b6d4" fontWeight="600">
                Offline SQLite
              </text>
            </g>

            {/* Node 2: Edge Storage (Top Right) */}
            <g
              transform="translate(368, 30)"
              onClick={() => setActiveStep("storage")}
              className="cursor-pointer"
            >
              <rect
                x="0"
                y="0"
                width="148"
                height="58"
                rx="12"
                className="fill-white dark:fill-[#121827] transition-all duration-300"
                stroke={activeStep === "storage" ? "#fb291a" : "currentColor"}
                strokeWidth={activeStep === "storage" ? "2" : "1"}
                strokeOpacity={activeStep === "storage" ? 1 : 0.12}
              />
              <circle cx="20" cy="29" r="5" fill="#fb291a" />
              <text x="34" y="25" fontFamily="sans-serif" fontSize="11" fontWeight="bold" className="fill-slate-900 dark:fill-white">
                Edge Storage
              </text>
              <text x="34" y="41" fontFamily="monospace" fontSize="8.5" fill="#fb291a" fontWeight="600">
                NVMe Cluster S3
              </text>
            </g>

            {/* Node 3: Telemetry Engine (Bottom Left) */}
            <g
              transform="translate(24, 212)"
              onClick={() => setActiveStep("telemetry")}
              className="cursor-pointer"
            >
              <rect
                x="0"
                y="0"
                width="148"
                height="58"
                rx="12"
                className="fill-white dark:fill-[#121827] transition-all duration-300"
                stroke={activeStep === "telemetry" ? "#f77241" : "currentColor"}
                strokeWidth={activeStep === "telemetry" ? "2" : "1"}
                strokeOpacity={activeStep === "telemetry" ? 1 : 0.12}
              />
              <circle cx="20" cy="29" r="5" fill="#f77241" />
              <text x="34" y="25" fontFamily="sans-serif" fontSize="11" fontWeight="bold" className="fill-slate-900 dark:fill-white">
                Telemetry
              </text>
              <text x="34" y="41" fontFamily="monospace" fontSize="8.5" fill="#f77241" fontWeight="600">
                Bắt lỗi runtime
              </text>
            </g>

            {/* Node 4: Supply Chain WMS (Bottom Right) */}
            <g
              transform="translate(368, 212)"
              onClick={() => setActiveStep("logistics")}
              className="cursor-pointer"
            >
              <rect
                x="0"
                y="0"
                width="148"
                height="58"
                rx="12"
                className="fill-white dark:fill-[#121827] transition-all duration-300"
                stroke={activeStep === "logistics" ? "#10b981" : "currentColor"}
                strokeWidth={activeStep === "logistics" ? "2" : "1"}
                strokeOpacity={activeStep === "logistics" ? 1 : 0.12}
              />
              <circle cx="20" cy="29" r="5" fill="#10b981" />
              <text x="34" y="25" fontFamily="sans-serif" fontSize="11" fontWeight="bold" className="fill-slate-900 dark:fill-white">
                Kho vận Fleet
              </text>
              <text x="34" y="41" fontFamily="monospace" fontSize="8.5" fill="#10b981" fontWeight="600">
                Định tuyến ETA
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}
