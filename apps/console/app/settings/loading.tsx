import { ConsoleShell } from "@/components/console-shell";
import { Skeleton, CardSkeleton } from "@workspace/ui/components/skeleton";

export default function Loading() {
  return (
    <ConsoleShell>
      <div className="space-y-8 max-w-4xl min-w-0 w-full">
        <div className="space-y-1">
          <Skeleton className="h-7 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 max-w-full rounded" />
        </div>
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </ConsoleShell>
  );
}
