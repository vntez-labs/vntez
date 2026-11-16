"use client"

import React from "react"
import { MODULE_NODES, PATH_CONFIGS } from "./diagram-config"

interface DiagramSvgCanvasProps {
  activeStep: string
  onSelectStep: (stepId: string) => void
}

export function DiagramSvgCanvas({
  activeStep,
  onSelectStep,
}: DiagramSvgCanvasProps) {
  const isAll = activeStep === "ecosystem"

  return (
    <div className="relative z-10 p-3 sm:p-5 flex items-center justify-center">
      <svg
        viewBox="0 0 540 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto select-none"
      >
        {/* Auxiliary Direct Inter-Service Meshes */}
        <path
          d="M 90 74 L 90 206"
          stroke="#E7E5E4"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          className="opacity-40 dark:opacity-30 dark:stroke-stone-700"
        />
        <path
          d="M 450 74 L 450 206"
          stroke="#E7E5E4"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          className="opacity-40 dark:opacity-30 dark:stroke-stone-700"
        />
        <path
          d="M 152 40 C 270 12, 270 12, 388 40"
          stroke="#E7E5E4"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          className="opacity-40 dark:opacity-30 dark:stroke-stone-700"
        />
        {/* Bottom Data Bus Trunk */}
        <path
          d="M 270 172 L 270 216"
          stroke="#E7E5E4"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          className="opacity-50 dark:opacity-30 dark:stroke-stone-700"
        />

        {/* 5 Inter-Service Paths connecting to vntez CORE */}
        {PATH_CONFIGS.map((p) => {
          const isActive = isAll || activeStep === p.stepId
          return (
            <g key={p.stepId}>
              <path
                d={p.d}
                fill="none"
                stroke={isActive ? "#F03E2F" : "#E7E5E4"}
                strokeWidth={isActive ? "2.5" : "1.5"}
                strokeOpacity={isActive ? 1 : 0.5}
                className="transition-all duration-300 dark:stroke-stone-700"
                style={isActive ? { stroke: "#F03E2F" } : undefined}
              />
              {isActive && (
                <path
                  d={p.d}
                  fill="none"
                  stroke="#F03E2F"
                  strokeWidth="2.5"
                  strokeDasharray="6 8"
                  strokeLinecap="round"
                  opacity="0.8"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="28"
                    to="0"
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                </path>
              )}
            </g>
          )
        })}

        {/* Dynamic Flying Data Particles */}
        {PATH_CONFIGS.map((p) => {
          const isActive = isAll || activeStep === p.stepId
          if (!isActive) return null
          return (
            <circle key={`particle-${p.stepId}`} r="3.5" fill="#F03E2F">
              <animateMotion dur="1.6s" repeatCount="indefinite" path={p.d} />
            </circle>
          )
        })}

        {/* Center Hub: vntez CORE (Event Bus & Unified Gateway) */}
        <g
          className="cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => onSelectStep("ecosystem")}
        >
          <rect
            x="195"
            y="108"
            width="150"
            height="64"
            rx="14"
            className="fill-white dark:fill-[#121927]"
            stroke={isAll ? "#F03E2F" : "#E7E5E4"}
            strokeWidth={isAll ? "2" : "1.2"}
            style={isAll ? { stroke: "#F03E2F" } : undefined}
          />
          <circle cx="218" cy="130" r="3.5" fill="#F03E2F" />
          <text
            x="270"
            y="134"
            textAnchor="middle"
            className="text-[12px] font-bold font-mono fill-[#1C1917] dark:fill-white"
          >
            vntez CORE
          </text>
          <text
            x="270"
            y="153"
            textAnchor="middle"
            className="text-[9px] font-mono fill-[#78716C] dark:fill-stone-400"
          >
            Event Bus &amp; Gateway
          </text>
        </g>

        {/* 5 Surrounding Modules */}
        {MODULE_NODES.map((node) => {
          const isActive = isAll || activeStep === node.id
          const cx = node.x + node.w / 2
          return (
            <g
              key={node.id}
              className="cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => onSelectStep(node.id)}
            >
              <rect
                x={node.x}
                y={node.y}
                width={node.w}
                height={node.h}
                rx="12"
                className="fill-white dark:fill-[#121927]"
                stroke={isActive ? "#F03E2F" : "#E7E5E4"}
                strokeWidth={isActive ? "2" : "1"}
                style={isActive ? { stroke: "#F03E2F" } : undefined}
              />
              <circle
                cx={node.x + 14}
                cy={node.y + 19}
                r="2.5"
                fill={isActive ? "#F03E2F" : "#D6D3D1"}
              />
              <text
                x={cx + 4}
                y={node.y + 22}
                textAnchor="middle"
                className={`text-[11px] font-bold font-mono transition-colors ${
                  isActive
                    ? "fill-[#F03E2F]"
                    : "fill-[#1C1917] dark:fill-stone-200"
                }`}
              >
                {node.title}
              </text>
              <text
                x={cx}
                y={node.y + 38}
                textAnchor="middle"
                className="text-[9px] font-mono fill-[#78716C] dark:fill-stone-400"
              >
                {node.subtitle}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
