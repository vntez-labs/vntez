"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

const themeOrder: ThemeMode[] = ["light", "dark", "system"];

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function MonitorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

export function ModeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/40 ${className}`}
      />
    );
  }

  const currentTheme = (theme ?? "system") as ThemeMode;

  const nextTheme =
    themeOrder[(themeOrder.indexOf(currentTheme) + 1) % themeOrder.length];

  const label =
    currentTheme === "system"
      ? "Theo hệ thống"
      : currentTheme === "dark"
        ? "Chế độ tối"
        : "Chế độ sáng";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      title={`Chủ đề: ${label}`}
      aria-label={`Chuyển chủ đề. Hiện tại: ${label}`}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/40 text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 ${className}`}
    >
      {currentTheme === "system" ? (
        <MonitorIcon />
      ) : resolvedTheme === "dark" ? (
        <MoonIcon />
      ) : (
        <SunIcon />
      )}

      <span className="sr-only">{label}</span>
    </button>
  );
}
