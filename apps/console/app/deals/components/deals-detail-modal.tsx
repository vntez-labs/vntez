"use client";

import React from "react";
import { Handshake, X, ExternalLink, Check, Copy } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useDealsStore } from "../deals-store";
import { getDealTypeBadge, getStatusBadge } from "./deals-table";

export function DealsDetailModal() {
  const { viewingRequest, setViewingRequest, handleCopy, copiedId } =
    useDealsStore();

  if (!viewingRequest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-2xl border-0 bg-white dark:bg-card p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#f5f2eb] dark:border-border/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Handshake className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-display">
                Chi tiết Hồ sơ Deal
              </h3>
              <p className="text-[11px] text-muted-foreground font-mono">
                Mã hồ sơ: {viewingRequest.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setViewingRequest(null)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-[#f5f2eb] hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Clean Details Body */}
        <div className="divide-y divide-[#f5f2eb] dark:divide-border/60 text-xs">
          {/* Row 1: Tên dự án & Hình thức */}
          <div className="py-3.5 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                Tên dự án / Ứng dụng
              </span>
              <p className="font-bold text-foreground text-sm mt-0.5">
                {viewingRequest.project_name}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                Hình thức Hợp tác
              </span>
              <div className="mt-0.5">
                {getDealTypeBadge(viewingRequest.deal_type)}
              </div>
            </div>
            {viewingRequest.project_website && (
              <div className="col-span-2 pt-1">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                  Website dự án
                </span>
                <a
                  href={viewingRequest.project_website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-primary mt-0.5 inline-flex items-center gap-1 hover:underline text-xs"
                >
                  <span>{viewingRequest.project_website}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          {/* Row 2: Người đại diện & Pháp nhân */}
          <div className="py-3.5 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                Người đại diện
              </span>
              <p className="font-semibold text-foreground mt-0.5">
                {viewingRequest.applicant_name}
              </p>
              <p className="font-mono text-muted-foreground text-[11px] mt-0.5">
                {viewingRequest.applicant_email}
              </p>
              {viewingRequest.applicant_phone && (
                <p className="font-mono text-muted-foreground text-[11px]">
                  {viewingRequest.applicant_phone}
                </p>
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                Chứng minh pháp nhân
              </span>
              <p className="font-medium text-foreground mt-0.5">
                {viewingRequest.identity_proof || "—"}
              </p>
            </div>
          </div>

          {/* Row 3: Ý tưởng & Giải pháp */}
          {viewingRequest.project_idea &&
            !viewingRequest.project_idea.startsWith("Ứng dụng ") && (
              <div className="py-3.5 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                  Ý tưởng & Giải pháp tích hợp
                </span>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap mt-1">
                  {viewingRequest.project_idea}
                </p>
              </div>
            )}

          {/* Row 4: Callback / Redirect URIs */}
          <div className="py-3.5 space-y-2">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
              Redirect URIs ({viewingRequest.requested_redirect_uris.length})
            </span>
            <div className="space-y-1 mt-1">
              {viewingRequest.requested_redirect_uris.map((uri, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between font-mono text-xs text-foreground bg-[#f8f6f0] dark:bg-muted/40 rounded-xl px-3 py-2"
                >
                  <span className="truncate">{uri}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(uri, `uri_${idx}`)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0 ml-2"
                  >
                    {copiedId === `uri_${idx}` ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Row 5: Trạng thái & Client ID */}
          <div className="py-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                Trạng thái thẩm định
              </span>
              <div>{getStatusBadge(viewingRequest.status)}</div>
            </div>

            {viewingRequest.approved_client_id && (
              <div className="pt-2">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                  Client ID đã cấp phát
                </span>
                <div className="flex items-center justify-between mt-1 bg-emerald-500/10 p-2.5 rounded-xl font-mono text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
                  <span>{viewingRequest.approved_client_id}</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(viewingRequest.approved_client_id!, "view_cid")
                    }
                    className="cursor-pointer ml-auto text-emerald-700 hover:text-emerald-900"
                  >
                    {copiedId === "view_cid" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {viewingRequest.admin_notes && (
              <div className="pt-2">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                  Ghi chú thẩm định
                </span>
                <p className="text-foreground mt-0.5">
                  {viewingRequest.admin_notes}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f5f2eb] dark:border-border/60">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewingRequest(null)}
            className="rounded-xl border-0 bg-[#f5f2eb] dark:bg-muted text-xs h-9 cursor-pointer"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
