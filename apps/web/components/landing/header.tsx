"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { IconMenu2, IconX } from "@tabler/icons-react"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { VntezLogo } from "./vntez-logo"
import { ThemeToggle } from "./theme-toggle"

const NAV_LINKS = [
  { label: "Sản phẩm", href: "/products" },
  { label: "Kiến trúc", href: "/#architecture" },
  { label: "Tài liệu", href: "/docs" },
  { label: "Blog", href: "/blog" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        scrolled
          ? "bg-white/85 dark:bg-[#080c14]/85 backdrop-blur-md border-b border-black/[0.04] dark:border-white/[0.04]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <VntezLogo size={28} />
          <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[#fb291a] transition-colors">
            vntez
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === pathname ||
              (link.href !== "/" && pathname.startsWith(link.href))

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors ${
                  isActive
                    ? "font-semibold text-[#fb291a]"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="headerActiveIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#fb291a] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Action Button & Theme Switcher */}
        <div className="flex items-center gap-3">
          <Link
            href="/products#vntez-id"
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "hidden sm:inline-flex font-semibold shadow-sm px-4",
            })}
          >
            Đăng nhập
          </Link>

          {/* Theme Switcher Sun/Moon */}
          <ThemeToggle />

          {/* Mobile Menu Button using Shadcn Button */}
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Chuyển đổi menu di động"
            className="md:hidden size-9"
          >
            {mobileMenuOpen ? <IconX className="size-4.5" /> : <IconMenu2 className="size-4.5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-black/[0.06] dark:border-white/[0.06] bg-white/95 dark:bg-[#080c14]/95 backdrop-blur-lg px-6 py-4 space-y-3"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === pathname ||
                (link.href !== "/" && pathname.startsWith(link.href))

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "font-semibold text-[#fb291a]"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
              <Link
                href="/products#vntez-id"
                className={buttonVariants({
                  variant: "default",
                  className: "w-full font-semibold",
                })}
              >
                Đăng nhập tài khoản
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
