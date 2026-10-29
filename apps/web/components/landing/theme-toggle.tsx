"use client"

import { useTheme } from "next-themes"
import { IconSun, IconMoon } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="size-9 rounded-lg border border-transparent" />
  }

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title={theme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      type="button"
      aria-label="Chuyển đổi giao diện sáng/tối"
      className="size-9"
    >
      {theme === "dark" ? (
        <IconSun className="size-4.5 text-amber-400" />
      ) : (
        <IconMoon className="size-4.5 text-slate-700" />
      )}
    </Button>
  )
}
