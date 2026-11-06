"use client";

import React, { useEffect } from "react";
import { ConsoleShell } from "@/components/console-shell";
import { StorageMeterCard } from "./components/storage-meter-card";
import { UploadDropzone } from "./components/upload-dropzone";
import { FilesTable } from "./components/files-table";
import { useStorageStore } from "./storage-store";
import { HardDrive, RefreshCw } from "lucide-react";

export default function StoragePage() {
  const { fetchMetrics, isLoading } = useStorageStore();

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <ConsoleShell>
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Cloudflare R2 Storage & Upload Worker
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Lưu trữ đối tượng Zero-Egress, phân mảnh Multipart Uploads và cấp Presigned S3 URLs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchMetrics()}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-white/80 px-3 py-2 text-xs font-semibold text-zinc-700 shadow-xs backdrop-blur-md hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Đồng bộ R2</span>
            </button>
          </div>
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
