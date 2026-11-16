"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { IconCheck } from "@tabler/icons-react"
import { FLOW_STEPS } from "./architecture/flow-steps-data"
import { ArchitectureInteractiveMap } from "./architecture/architecture-interactive-map"

export function ArchitectureFlow() {
  const [activeStep, setActiveStep] = useState<string>("id")
  const current = FLOW_STEPS.find((s) => s.id === activeStep) ?? FLOW_STEPS[0]!

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28 space-y-8 sm:space-y-10">
      {/* 6-Step Stepper Navigation (Consistent Warm Brand Palette) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 w-full">
        {FLOW_STEPS.map((step) => {
          const isActive = step.id === activeStep
          const stepLabel = step.tabLabel.replace(/^\d+\s*·\s*/, "")

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(step.id)}
              className={`group relative flex items-center justify-center text-center p-3 sm:py-3.5 sm:px-2 rounded-xl transition-all cursor-pointer border ${
                isActive
                  ? "bg-white dark:bg-[#0c121e] border-[#E7E5E4] dark:border-stone-700 shadow-[0_2px_12px_rgba(28,25,23,0.06)]"
                  : "bg-white/60 dark:bg-stone-900/40 border-stone-200/60 dark:border-stone-800/60 hover:bg-white dark:hover:bg-stone-800/60 hover:border-[#E7E5E4] dark:hover:border-stone-700 shadow-[0_1px_3px_rgba(28,25,23,0.02)]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeArchitectureTab"
                  className="absolute bottom-0 inset-x-3 h-[2px] bg-[#F03E2F] rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5">
                <span
                  className={
                    isActive
                      ? "text-[#F03E2F] font-bold font-mono"
                      : "text-[#78716C] dark:text-stone-500 font-mono group-hover:text-[#F03E2F]"
                  }
                >
                  {step.stepNum}
                </span>
                <span className="text-[#D6D3D1] dark:text-stone-600 select-none">
                  ·
                </span>
                <span
                  className={
                    isActive
                      ? "text-[#1C1917] dark:text-white font-bold"
                      : "text-[#57534E] dark:text-stone-400 font-medium group-hover:text-[#1C1917] dark:group-hover:text-stone-200"
                  }
                >
                  {stepLabel}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Dynamic Graphic Pipeline View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
        {/* Left: Step Details & Technical Highlights */}
        <div className="lg:col-span-5 flex flex-col justify-center min-h-[240px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#F03E2F]">
                BƯỚC {current.stepNum} // {current.role}
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C1917] dark:text-white leading-[1.2] text-balance">
                {current.title}
              </h2>

              <p className="text-sm sm:text-base text-[#57534E] dark:text-stone-300 leading-relaxed font-sans text-balance">
                {current.desc}
              </p>

              {/* 2-3 Crisp Inline Technical Highlights */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-2 text-xs font-mono">
                {current.highlights.map((item, idx) => (
                  <React.Fragment key={item}>
                    {idx > 0 && (
                      <span className="text-[#D6D3D1] dark:text-stone-700 font-bold select-none">
                        /
                      </span>
                    )}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-stone-800/60 border border-[#E7E5E4] dark:border-stone-700 text-[#1C1917] dark:text-stone-200 font-medium shadow-[0_1px_2px_rgba(28,25,23,0.02)]">
                      <IconCheck className="size-3.5 text-[#F03E2F] shrink-0" />
                      <span>{item}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Step-Aware Interactive SVG Map */}
        <div className="lg:col-span-7">
          <ArchitectureInteractiveMap
            activeStep={activeStep}
            onSelectStep={setActiveStep}
          />
        </div>
      </div>
    </section>
  )
}
