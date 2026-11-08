import { ConsoleShell } from "@/components/console-shell";
import { Skeleton, TableSkeleton } from "@workspace/ui/components/skeleton";

export default function Loading() {
  return (
    <ConsoleShell>
      <div className="space-y-6 min-w-0 w-full max-w-full">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="space-y-1">
            <Skeleton className="h-7 w-56 rounded-xl" />
            <Skeleton className="h-4 w-80 max-w-full rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-64 rounded-xl" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>

        {/* Users Table Skeleton */}
        <TableSkeleton rows={7} columns={5} />
      </div>
    </ConsoleShell>
  );
}
