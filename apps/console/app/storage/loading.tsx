import { ConsoleShell } from "@/components/console-shell";
import { Skeleton, TableSkeleton } from "@workspace/ui/components/skeleton";

export default function Loading() {
  return (
    <ConsoleShell>
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-7 w-56 rounded-xl" />
          </div>
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>

        {/* Quota Gauge Skeleton */}
        <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-card/70 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-6 w-48 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>

        {/* Upload Dropzone Skeleton */}
        <div className="h-32 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-card/40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-48 rounded" />
          </div>
        </div>

        {/* Files Table Skeleton */}
        <TableSkeleton rows={5} columns={5} />
      </div>
    </ConsoleShell>
  );
}
