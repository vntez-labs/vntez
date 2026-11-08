import { ConsoleShell } from "@/components/console-shell";
import { Skeleton, CardSkeleton } from "@workspace/ui/components/skeleton";

export default function Loading() {
  return (
    <ConsoleShell>
      <div className="space-y-8 min-w-0 w-full max-w-full">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            <Skeleton className="h-9 w-72 rounded-xl" />
            <Skeleton className="h-4 w-96 max-w-full rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-24 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Skeleton className="h-10 w-full max-w-md rounded-xl" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-16 rounded-xl" />
            <Skeleton className="h-8 w-20 rounded-xl" />
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </ConsoleShell>
  );
}
