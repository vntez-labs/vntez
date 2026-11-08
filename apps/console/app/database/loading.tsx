import { ConsoleShell } from "@/components/console-shell";
import { Skeleton, TableSkeleton } from "@workspace/ui/components/skeleton";

export default function Loading() {
  return (
    <ConsoleShell>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-6 w-6 rounded-lg" />
              <Skeleton className="h-7 w-64 rounded-xl" />
            </div>
            <Skeleton className="h-4 w-96 max-w-full rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-36 rounded-xl" />
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left: Table Selector Skeleton */}
          <div className="w-full lg:w-72 shrink-0 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-card/70 p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-5 w-8 rounded-full" />
            </div>
            <Skeleton className="h-9 w-full rounded-xl" />
            <div className="space-y-1.5 pt-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-xl" />
              ))}
            </div>
          </div>

          {/* Right: Database Grid Skeleton */}
          <div className="flex-1 min-w-0 w-full">
            <TableSkeleton rows={8} columns={6} />
          </div>
        </div>
      </div>
    </ConsoleShell>
  );
}
