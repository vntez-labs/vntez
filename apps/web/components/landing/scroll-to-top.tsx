"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { IconArrowUp } from "@tabler/icons-react"

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Cuộn lên đầu trang"
          className="fixed bottom-6 right-6 z-50 flex size-11 sm:size-12 items-center justify-center rounded-full bg-white/90 dark:bg-[#0c121e]/90 text-slate-700 dark:text-slate-200 border border-black/[0.08] dark:border-white/[0.1] shadow-lg backdrop-blur-md hover:border-[#fb291a]/50 hover:text-[#fb291a] dark:hover:text-[#fb291a] transition-colors"
        >
          <IconArrowUp className="size-5" strokeWidth={2.2} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
