"use client";

import React from "react";
import { Clock, XCircle } from "lucide-react";
import type { ClientRequestRecord } from "@/lib/client-requests";

interface ExistingProposalsListProps {
  pendingRequests: ClientRequestRecord[];
  rejectedRequests: ClientRequestRecord[];
}

export function ExistingProposalsList({
  pendingRequests,
  rejectedRequests,
}: ExistingProposalsListProps) {
  const total = pendingRequests.length + rejectedRequests.length;
  if (total === 0) return null;

  return (
    <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl p-6 space-y-4">
      <h3 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        Hồ sơ Đề xuất đã gửi của bạn ({total})
      </h3>

      <div className="space-y-3">
        {pendingRequests.map((req) => (
          <div
            key={req.id}
            className="p-4 rounded-xl bg-amber-500/5 border-0 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground text-sm font-display">
                {req.project_name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 font-semibold text-[11px] flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Đang chờ Ban quản trị duyệt
              </span>
            </div>
            <p className="text-muted-foreground">{req.project_idea}</p>
            <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-3 pt-1">
              <span>Nộp lúc: {new Date(req.created_at).toLocaleString("vi-VN")}</span>
              <span>•</span>
              <span>Redirect URIs: {req.requested_redirect_uris.join(", ")}</span>
            </div>
          </div>
        ))}

        {rejectedRequests.map((req) => (
          <div
            key={req.id}
            className="p-4 rounded-xl bg-destructive/5 border-0 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground text-sm font-display">
                {req.project_name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold text-[11px] flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Chưa đạt yêu cầu
              </span>
            </div>
            <p className="text-muted-foreground">{req.project_idea}</p>
            {req.admin_notes && (
              <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs">
                <strong>Phản hồi từ Admin:</strong> {req.admin_notes}
              </div>
            )}
            <p className="text-[11px] text-muted-foreground">
              Bạn có thể hoàn thiện thông tin và nộp lại đề xuất mới bên dưới.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
