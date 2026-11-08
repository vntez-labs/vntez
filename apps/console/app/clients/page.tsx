"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";

export default function ClientsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/apps");
  }, [router]);

  return (
    <AuthGuard>
      <ConsoleShell>
        <div className="flex h-72 items-center justify-center rounded-2xl bg-white dark:bg-card shadow-xs">
          <span className="text-xs text-muted-foreground animate-pulse">
            Đang chuyển hướng sang trang Quản lý Ứng dụng & OAuth...
          </span>
        </div>
      </ConsoleShell>
    </AuthGuard>
  );
}
