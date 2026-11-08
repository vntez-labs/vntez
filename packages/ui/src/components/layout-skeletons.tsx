import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";
import {
  Skeleton,
  PageHeaderSkeleton,
  StatsCardsSkeleton,
  TableSkeleton,
} from "@workspace/ui/components/skeleton";

export function DashboardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6 max-w-7xl min-w-0 w-full", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-8 w-80 rounded-lg" />
          <Skeleton className="h-4 w-60 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-36 rounded-xl" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>
      </div>

      <StatsCardsSkeleton count={4} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <TableSkeleton rows={5} columns={5} />
        </div>
        <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-card/70 p-5 shadow-xs space-y-4">
          <Skeleton className="h-5 w-40 rounded" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/40">
                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DocsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-h-screen w-full bg-background", className)}>
      {/* Col 1: Sidebar Nav Skeleton */}
      <aside className="w-72 shrink-0 border-r border-border p-6 space-y-6 hidden lg:block">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-9 w-full rounded-xl" />
        <div className="space-y-4 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3.5 w-24 rounded" />
              <div className="space-y-1.5 pl-2">
                <Skeleton className="h-7 w-full rounded-lg" />
                <Skeleton className="h-7 w-full rounded-lg" />
                <Skeleton className="h-7 w-4/5 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Col 2: Content Specs Skeleton */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 min-w-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-48 rounded-md" />
          </div>
          <Skeleton className="h-9 w-3/4 max-w-lg rounded-xl" />
          <Skeleton className="h-4 w-full max-w-xl rounded" />
        </div>

        {/* Flat HTTP URL bar skeleton */}
        <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/40">
          <Skeleton className="h-6 w-14 rounded-md shrink-0" />
          <Skeleton className="h-4 flex-1 rounded font-mono" />
          <Skeleton className="h-7 w-16 rounded-md shrink-0" />
        </div>

        {/* Parameters Table Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-36 rounded" />
          <TableSkeleton rows={4} columns={4} />
        </div>
      </main>

      {/* Col 3: Terminal Code Console Skeleton */}
      <aside className="w-96 shrink-0 border-l border-border bg-[#0b0f19] p-6 space-y-4 hidden xl:block">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-md bg-white/10" />
            <Skeleton className="h-6 w-20 rounded-md bg-white/10" />
          </div>
          <Skeleton className="h-6 w-14 rounded-md bg-white/10" />
        </div>
        <div className="space-y-2 pt-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn(
                "h-4 rounded bg-white/10",
                i % 3 === 0 ? "w-4/5" : i % 2 === 0 ? "w-2/3" : "w-1/2"
              )}
            />
          ))}
        </div>
      </aside>
    </div>
  );
}

export function ProductsGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="aspect-[16/10] w-full rounded-2xl bg-zinc-100 dark:bg-[#0c121e] border border-border flex items-center justify-center p-6 relative overflow-hidden">
              <Skeleton className="size-24 rounded-2xl" />
              <div className="absolute top-3.5 left-3.5">
                <Skeleton className="h-5 w-20 rounded-md" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-2/3 rounded-lg" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-8 w-28 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BlogGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-card/70 p-5 shadow-xs space-y-4"
        >
          <div className="aspect-[16/9] w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/60 relative overflow-hidden flex items-center justify-center">
            <Skeleton className="size-16 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
            <Skeleton className="h-6 w-4/5 rounded-lg" />
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-3/4 rounded" />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
            <div className="flex items-center gap-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
            <Skeleton className="h-4 w-12 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ArticleDetailSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("max-w-4xl mx-auto px-6 py-12 space-y-8", className)}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-32 rounded" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-4/5 rounded-xl" />
      </div>

      <div className="flex items-center gap-4 py-4 border-y border-border">
        <Skeleton className="size-11 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-3 w-48 rounded" />
        </div>
      </div>

      <Skeleton className="aspect-[16/9] w-full rounded-3xl" />

      <div className="space-y-4 pt-4">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <div className="py-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
      </div>
    </div>
  );
}
