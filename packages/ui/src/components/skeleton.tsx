import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

export function Skeleton({
  className,
  shimmer = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-md bg-zinc-200/70 dark:bg-zinc-800/70",
        shimmer
          ? "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/40 dark:before:via-white/5 before:to-transparent"
          : "animate-pulse",
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-card/70 p-6 shadow-xs space-y-4",
        className
      )}
      {...props}
    >
      {children || (
        <>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-20 w-full rounded-xl" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </>
      )}
    </div>
  );
}

export function TableSkeleton({
  rows = 5,
  columns = 5,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-card/70 p-4 shadow-xs",
        className
      )}
    >
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-4 py-2 border-b border-zinc-100 dark:border-zinc-800/60">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div
            key={rIdx}
            className="flex items-center gap-4 py-3 border-b border-zinc-50 dark:border-zinc-800/30 last:border-0"
          >
            {Array.from({ length: columns }).map((_, cIdx) => (
              <Skeleton
                key={cIdx}
                className={cn(
                  "h-4 flex-1",
                  cIdx === 0 && "w-1/4 flex-none",
                  cIdx === columns - 1 && "w-20 flex-none"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "space-y-3 pb-6 border-b border-zinc-100 dark:border-zinc-800/60",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>
      <Skeleton className="h-8 w-72 rounded-lg" />
      <Skeleton className="h-4 w-96 max-w-full rounded-md" />
    </div>
  );
}

export function StatsCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-card/70 p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-20 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
      ))}
    </div>
  );
}
