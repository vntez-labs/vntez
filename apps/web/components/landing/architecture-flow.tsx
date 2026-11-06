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
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28 space-y-12 sm:space-y-16">
      {/* Step Selector Pills */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
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

      {/* Dynamic Graphic Pipeline View */}
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

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300">
                <IconCheck className="size-3.5 text-emerald-500 shrink-0" />
                <span>{current.metric}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Interactive SVG Map */}
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
