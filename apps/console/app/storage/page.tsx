"use client";

import React, { useEffect } from "react";
import { ConsoleShell } from "@/components/console-shell";
import { StorageMeterCard } from "./components/storage-meter-card";
import { UploadDropzone } from "./components/upload-dropzone";
import { FilesTable } from "./components/files-table";
import { useStorageStore } from "./storage-store";
import { HardDrive } from "lucide-react";

export default function StoragePage() {
  const { fetchMetrics, isLoading } = useStorageStore();

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <ConsoleShell>
      <div className="space-y-5">
        {/* Page Title */}
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
            <HardDrive className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold font-display text-foreground">
            R2 Storage & Uploads
          </h1>
        </div>

        {/* Storage Meter Quota Gauge */}
        <StorageMeterCard />

        {/* Upload Dropzone */}
        <UploadDropzone />

        {/* Files Table */}
        <FilesTable />
      </div>
    </ConsoleShell>
  );
}
