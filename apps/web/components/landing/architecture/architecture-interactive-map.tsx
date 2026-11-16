"use client"

import React from "react"
import { motion, AnimatePresence } from "motion/react"
import { FLOW_STEPS } from "./flow-steps-data"
import { DiagramSvgCanvas } from "./diagram-svg-canvas"

interface ArchitectureInteractiveMapProps {
  activeStep: string
  onSelectStep: (stepId: string) => void
}

export function ArchitectureInteractiveMap({
  activeStep,
  onSelectStep,
}: ArchitectureInteractiveMapProps) {
  const currentStep =
    FLOW_STEPS.find((s) => s.id === activeStep) ?? FLOW_STEPS[0]!
  const isAll = activeStep === "ecosystem"

  return (
    <div className="relative w-full rounded-2xl border border-[#E7E5E4] dark:border-stone-800 bg-white dark:bg-[#0c121e] shadow-[0_2px_12px_rgba(28,25,23,0.04)] overflow-hidden flex flex-col">
      {/* Subtle Warm Dot-Grid Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(#E7E5E4_1px,transparent_1px)] dark:bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:16px_16px]"
      />

      {/* Top Topology Ribbon */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-3.5 pb-2 border-b border-stone-100 dark:border-stone-800/60 font-mono text-[10px]">
        <div className="flex items-center gap-1.5 text-stone-400">
          <span className="size-2 rounded-full bg-stone-300 dark:bg-stone-700" />
          <span className="size-2 rounded-full bg-stone-300 dark:bg-stone-700" />
          <span className="size-2 rounded-full bg-[#F03E2F]/60" />
          <span className="ml-1.5 font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            VNTEZ DISTRIBUTED TOPOLOGY
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[#F03E2F] font-semibold">
          <span className="size-1.5 rounded-full bg-[#F03E2F] animate-pulse" />
          <span>
            {isAll
              ? "MESH SYNCHRONIZED"
              : `FLOW // ${currentStep.id.toUpperCase()}`}
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <DiagramSvgCanvas
        activeStep={activeStep}
        onSelectStep={onSelectStep}
      />

      {/* Live Payload Pill at the bottom of the diagram */}
      <div className="relative z-10 px-5 pb-3 -mt-1 flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-2 max-w-full px-3.5 py-1.5 rounded-full bg-[#FAF9F6] dark:bg-stone-900/90 border border-[#E7E5E4] dark:border-stone-700/80 shadow-[0_1px_4px_rgba(28,25,23,0.04)] text-xs font-mono"
          >
            <span className="size-2 rounded-full bg-[#F03E2F] animate-pulse shrink-0" />
            <span className="text-[#1C1917] dark:text-stone-200 font-semibold truncate">
              {currentStep.payloadPill}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Live Protocol / Telemetry Status Footer */}
      <div className="relative z-10 flex items-center justify-between px-5 py-3 border-t border-[#E7E5E4] dark:border-stone-800 bg-[#FAF9F6] dark:bg-[#090e18] font-mono text-[11px] text-[#78716C] dark:text-stone-400">
        <div className="flex items-center gap-2 truncate">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-semibold text-[#1C1917] dark:text-stone-200 truncate">
            {currentStep.telemetry}
          </span>
        </div>
        <span className="shrink-0 text-emerald-600 dark:text-emerald-400 font-semibold hidden sm:inline">
          Live Telemetry
        </span>
      </div>
    </div>
  )
}
