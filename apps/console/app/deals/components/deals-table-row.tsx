"use client";

import React from "react";
import {
  ExternalLink,
  Copy,
  Check,
  Edit,
  Trash2,
  Eye,
  ShieldCheck,
  Globe,
  Phone,
  Mail,
  FileCheck2,
  XCircle,
} from "lucide-react";
import type { ClientRequestRecord } from "@/lib/client-requests";
import { useDealsStore } from "../deals-store";
import { getDealTypeBadge, getStatusBadge } from "./deals-badges";

interface DealsTableRowProps {
  req: ClientRequestRecord;
}

export function DealsTableRow({ req }: DealsTableRowProps) {
  const {
    copiedId,
    handleCopy,
    openEditModal,
    setViewingRequest,
    setApprovingRequest,
    setDecliningRequest,
    setDeletingRequest,
    setAdminNotesInput,
  } = useDealsStore();

  return (
    <tr className="hover:bg-[#faf8f3] dark:hover:bg-muted/30 transition-colors">
      {/* Project & Deal Type */}
      <td className="py-3.5 pl-6 pr-4 align-top">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-sm">
              {req.project_name}
            </span>
            {getDealTypeBadge(req.deal_type)}
          </div>
          {req.project_website && (
            <a
              href={req.project_website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-mono"
            >
              <Globe className="h-3 w-3" />
              <span>{req.project_website.replace(/^https?:\/\//, "")}</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
        </div>
      </td>

      {/* Applicant Info */}
      <td className="py-3.5 px-4 align-top">
        <div className="space-y-1">
          <p className="font-medium text-foreground">{req.applicant_name}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate max-w-[170px]">{req.applicant_email}</span>
          </div>
          {req.applicant_phone && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
              <Phone className="h-3 w-3 shrink-0" />
              <span>{req.applicant_phone}</span>
            </div>
          )}
        </div>
      </td>

      {/* Identity Proof */}
      <td className="py-3.5 px-4 align-top">
        <div className="max-w-[200px]">
          {req.identity_proof ? (
            <div className="flex items-start gap-1.5">
              <FileCheck2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-[11px] text-foreground font-medium line-clamp-2">
                {req.identity_proof}
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground/40 font-mono">—</span>
          )}
        </div>
      </td>

      {/* Project Idea & Redirects */}
      <td className="py-3.5 px-4 align-top">
        <div className="max-w-[260px] space-y-1">
          {req.project_idea && !req.project_idea.startsWith("Ứng dụng ") && (
            <p className="text-[11px] text-muted-foreground line-clamp-1 mb-1">
              {req.project_idea}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1 font-mono text-[10px]">
            {req.requested_redirect_uris.slice(0, 2).map((uri, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-[#f6f4ee] dark:bg-stone-800 text-stone-700 dark:text-stone-300 truncate max-w-[210px] inline-block font-mono"
                title={uri}
              >
                {uri.replace(/^https?:\/\//, "")}
              </span>
            ))}
            {req.requested_redirect_uris.length > 2 && (
              <span className="text-muted-foreground text-[10px]">
                +{req.requested_redirect_uris.length - 2}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Status & Client ID */}
      <td className="py-3.5 px-4 align-top">
        <div className="space-y-1.5">
          <div>{getStatusBadge(req.status)}</div>

          {/* Approved Client ID */}
          {req.status === "approved" && req.approved_client_id && (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 rounded-lg px-2 py-1 max-w-[210px]">
              <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-mono text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 truncate">
                {req.approved_client_id}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(req.approved_client_id!, `cid_${req.id}`)}
                className="text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer ml-auto"
                title="Sao chép Client ID"
              >
                {copiedId === `cid_${req.id}` ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          )}

          {/* Rejection Note */}
          {req.status === "rejected" && req.admin_notes && (
            <p className="text-[10px] text-rose-600 dark:text-rose-400 line-clamp-2 max-w-[200px]">
              Lý do: {req.admin_notes}
            </p>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="py-3.5 pl-4 pr-6 align-top text-right">
        <div className="flex items-center justify-end gap-1.5">
          {req.status === "pending" && (
            <>
              <button
                type="button"
                onClick={() => {
                  setApprovingRequest(req);
                  setAdminNotesInput(
                    `Hồ sơ dự án ${req.project_name} đạt chuẩn thẩm định đối tác. Đã phê duyệt cấp Client ID.`
                  );
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                title="Phê duyệt Deal & Cấp Client ID"
              >
                <Check className="h-3 w-3" />
                <span>Duyệt</span>
              </button>

              <button
                type="button"
                onClick={() => setDecliningRequest(req)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-medium transition-colors cursor-pointer"
                title="Từ chối Deal"
              >
                <XCircle className="h-3 w-3" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setViewingRequest(req)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#f6f4ee] dark:hover:bg-muted transition-colors cursor-pointer"
            title="Xem chi tiết hồ sơ thẩm định"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => openEditModal(req)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#f6f4ee] dark:hover:bg-muted transition-colors cursor-pointer"
            title="Chỉnh sửa hồ sơ"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setDeletingRequest(req)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            title="Xóa hồ sơ Deal"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
