import Link from "next/link";
import type { ReactNode } from "react";
import { ModeToggle } from "@/components/ThemeToggle";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "lucide-react";

export type LegalAccent = "primary" | "success" | "info";

const A: Record<
  LegalAccent,
  { num: string; marker: string; link: string; chip: string; badge: string }
> = {
  primary: {
    num: "text-primary",
    marker: "[&_li::marker]:text-primary",
    link: "text-primary decoration-primary/30 underline-offset-4 hover:decoration-primary/70",
    chip: "border-primary/25 bg-primary/10 text-primary",
    badge: "text-primary",
  },
  success: {
    num: "text-emerald-500",
    marker: "[&_li::marker]:text-emerald-500",
    link: "text-emerald-500 decoration-emerald-500/30 underline-offset-4 hover:decoration-emerald-500/70",
    chip: "border-emerald-500/25 bg-emerald-500/10 text-emerald-500",
    badge: "text-emerald-500",
  },
  info: {
    num: "text-sky-500",
    marker: "[&_li::marker]:text-sky-500",
    link: "text-sky-500 decoration-sky-500/30 underline-offset-4 hover:decoration-sky-500/70",
    chip: "border-sky-500/25 bg-sky-500/10 text-sky-500",
    badge: "text-sky-500",
  },
};

const pad = (n: number) => String(n).padStart(2, "0");

export function LegalSection({
  n,
  title,
  accent = "primary",
  children,
}: {
  n?: number;
  title: string;
  accent?: LegalAccent;
  children: ReactNode;
}) {
  const a = A[accent];
  return (
    <section>
      <header className="mb-5 flex items-baseline gap-3 border-b border-border pb-3">
        {n != null && (
          <span className={`font-mono text-xs tabular-nums ${a.num}`}>
            {pad(n)}
          </span>
        )}
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
      </header>

      <div
        className={`space-y-3 text-[15px] leading-7 text-foreground/80 [&_strong]:text-foreground [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 ${a.marker}`}
      >
        {children}
      </div>
    </section>
  );
}

export function LegalChip({
  accent = "primary",
  children,
}: {
  accent?: LegalAccent;
  children: ReactNode;
}) {
  const a = A[accent];
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${a.chip}`}>
      {children}
    </span>
  );
}

export function LegalShell({
  title,
  updatedAt,
  badge,
  accent = "primary",
  backHref = "/login",
  footerLink,
  children,
}: {
  title: string;
  updatedAt: string;
  badge: string;
  accent?: LegalAccent;
  backHref?: string;
  footerLink?: { href: string; label: string };
  children: ReactNode;
}) {
  const a = A[accent];
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground transition-colors">
      <div className="mx-auto w-full max-w-3xl px-6 py-12 md:py-20">
        <div className="mb-10 flex items-center justify-between">
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại</span>
            </Link>
          </Button>
          <ModeToggle />
        </div>

        <header className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <img src="/logo.svg" alt="VNTEZ ID" className="h-7 w-7 rounded-md" />
            <span
              className={`font-mono text-xs uppercase tracking-[0.22em] font-bold ${a.badge}`}
            >
              {badge}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Cập nhật lần cuối:{" "}
            <span className="font-mono text-foreground/90 font-medium">{updatedAt}</span>
          </p>
        </header>

        <article className="space-y-10">{children}</article>

        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VNTEZ Cloud. All rights reserved.
          </p>
          {footerLink && (
            <Link
              href={footerLink.href}
              className={`text-sm font-medium underline ${a.link}`}
            >
              {footerLink.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
