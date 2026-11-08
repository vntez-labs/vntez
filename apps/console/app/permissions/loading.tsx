import { ConsoleShell } from "@/components/console-shell";
import { Skeleton, TableSkeleton } from "@workspace/ui/components/skeleton";

export default function Loading() {
  return (
    <ConsoleShell>
      <div className="space-y-5 max-w-7xl min-w-0 w-full">
        <div className="space-y-1">
          <Skeleton className="h-7 w-64 rounded-xl" />
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-xl" />
          ))}
        </div>
        <TableSkeleton rows={6} columns={6} />
      </div>
    </ConsoleShell>
  );
}
