"use client";

import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { UnderConstructionView } from "@workspace/ui/components/under-construction-view";

export default function AuditLogsPage() {
  return (
    <AuthGuard>
      <ConsoleShell>
        <UnderConstructionView
          featureName="Nhật ký kiểm toán hệ thống (Audit Logs)"
          phase="Private Beta"
          progressPercent={85}
          backHref="/"
          docsHref="https://vntez.cloud/docs"
        />
      </ConsoleShell>
    </AuthGuard>
  );
}
