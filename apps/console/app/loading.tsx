import { ConsoleShell } from "@/components/console-shell";
import { DashboardSkeleton } from "@workspace/ui/components/layout-skeletons";

export default function Loading() {
  return (
    <ConsoleShell>
      <DashboardSkeleton />
    </ConsoleShell>
  );
}
