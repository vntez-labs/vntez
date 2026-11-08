import { ConsoleShell } from "@/components/console-shell";
import { Skeleton, CardSkeleton, TableSkeleton } from "@workspace/ui/components/skeleton";

export default function Loading() {
  return (
    <ConsoleShell>
      <div className="space-y-5 max-w-7xl min-w-0 w-full">
        <Skeleton className="h-7 w-48 rounded-xl" />
        <CardSkeleton />
        <TableSkeleton rows={5} columns={4} />
      </div>
    </ConsoleShell>
  );
}
