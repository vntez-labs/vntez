"use client"

import React from "react"

interface ArchitectureInteractiveMapProps {
  activeStep: string
  onSelectStep: (stepId: string) => void
}

export function ArchitectureInteractiveMap({
  activeStep,
  onSelectStep,
}: ArchitectureInteractiveMapProps) {
  return (
    <div className="relative aspect-[16/10] w-full rounded-2xl bg-slate-50/80 dark:bg-[#0c121e] flex items-center justify-center p-6 sm:p-8 overflow-hidden">
      <svg
        viewBox="0 0 540 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[500px] select-none"
      >
        <defs>
          <linearGradient id="topArchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#fb291a" />
            <stop offset="100%" stopColor="#fb291a" />
          </linearGradient>

          <linearGradient id="bottomArchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f77241" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

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

        {/* Dynamic Flying Data Particles */}
        {activeStep === "pos" && (
          <circle r="4" fill="#06b6d4">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M 172 59 C 220 59, 215 150, 230 150" />
          </circle>
        )}
        {activeStep === "storage" && (
          <circle r="4" fill="#fb291a">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M 230 150 C 245 150, 320 59, 368 59" />
          </circle>
        )}
        {activeStep === "telemetry" && (
          <circle r="4" fill="#f77241">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M 230 150 C 215 150, 220 241, 172 241" />
          </circle>
        )}
        {activeStep === "logistics" && (
          <circle r="4" fill="#10b981">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M 310 150 C 325 150, 320 241, 368 241" />
          </circle>
        )}

        {/* NODE 1: Center Core vntez-iam / Ecosystem Hub */}
        <g
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => onSelectStep("id")}
        >
          <rect
            x="220"
            y="110"
            width="100"
            height="80"
            rx="16"
            className="fill-white dark:fill-[#101726] stroke-slate-200 dark:stroke-white/10"
            strokeWidth={activeStep === "id" || activeStep === "ecosystem" ? "2" : "1"}
            stroke={activeStep === "id" ? "#fb291a" : activeStep === "ecosystem" ? "#a855f7" : undefined}
          />
          <circle cx="270" cy="140" r="14" fill="#fb291a" fillOpacity="0.1" />
          <path d="M 264 135 L 270 145 L 276 135" stroke="#fb291a" strokeWidth="2" strokeLinecap="round" />
          <text x="270" y="172" textAnchor="middle" className="text-[11px] font-bold font-mono fill-slate-800 dark:fill-white">
            vntez CORE
          </text>
        </g>

        {/* NODE 2: Top-Left BMAN POS */}
        <g
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => onSelectStep("pos")}
        >
          <rect
            x="72"
            y="25"
            width="100"
            height="68"
            rx="14"
            className="fill-white dark:fill-[#101726] stroke-slate-200 dark:stroke-white/10"
            strokeWidth={activeStep === "pos" ? "2" : "1"}
            stroke={activeStep === "pos" ? "#06b6d4" : undefined}
          />
          <text x="122" y="54" textAnchor="middle" className="text-[11px] font-bold font-mono fill-cyan-500">
            BMAN POS
          </text>
          <text x="122" y="72" textAnchor="middle" className="text-[9px] font-mono fill-slate-400">
            SQLite (WAL)
          </text>
        </g>

        {/* NODE 3: Top-Right Storage NVMe */}
        <g
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => onSelectStep("storage")}
        >
          <rect
            x="368"
            y="25"
            width="100"
            height="68"
            rx="14"
            className="fill-white dark:fill-[#101726] stroke-slate-200 dark:stroke-white/10"
            strokeWidth={activeStep === "storage" ? "2" : "1"}
            stroke={activeStep === "storage" ? "#fb291a" : undefined}
          />
          <text x="418" y="54" textAnchor="middle" className="text-[11px] font-bold font-mono fill-[#fb291a]">
            Edge S3
          </text>
          <text x="418" y="72" textAnchor="middle" className="text-[9px] font-mono fill-slate-400">
            HAN/SGN NVMe
          </text>
        </g>

        {/* NODE 4: Bottom-Left Telemetry */}
        <g
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => onSelectStep("telemetry")}
        >
          <rect
            x="72"
            y="207"
            width="100"
            height="68"
            rx="14"
            className="fill-white dark:fill-[#101726] stroke-slate-200 dark:stroke-white/10"
            strokeWidth={activeStep === "telemetry" ? "2" : "1"}
            stroke={activeStep === "telemetry" ? "#f77241" : undefined}
          />
          <text x="122" y="236" textAnchor="middle" className="text-[11px] font-bold font-mono fill-orange-500">
            Telemetry
          </text>
          <text x="122" y="254" textAnchor="middle" className="text-[9px] font-mono fill-slate-400">
            &lt; 8KB Trace
          </text>
        </g>

        {/* NODE 5: Bottom-Right Smart WMS & Fleet */}
        <g
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => onSelectStep("logistics")}
        >
          <rect
            x="368"
            y="207"
            width="100"
            height="68"
            rx="14"
            className="fill-white dark:fill-[#101726] stroke-slate-200 dark:stroke-white/10"
            strokeWidth={activeStep === "logistics" ? "2" : "1"}
            stroke={activeStep === "logistics" ? "#10b981" : undefined}
          />
          <text x="418" y="236" textAnchor="middle" className="text-[11px] font-bold font-mono fill-emerald-500">
            WMS Fleet
          </text>
          <text x="418" y="254" textAnchor="middle" className="text-[9px] font-mono fill-slate-400">
            TSP Routing
          </text>
        </g>
      </svg>
    </div>
  )
}
