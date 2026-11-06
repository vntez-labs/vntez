import React from "react";
import {
  Building,
  Handshake,
  Sparkles,
  User,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

export function getDealTypeBadge(type: string) {
  switch (type) {
    case "enterprise":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
          <Building className="h-2.5 w-2.5" />
          Doanh nghiệp
        </span>
      );
    case "partner":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
          <Handshake className="h-2.5 w-2.5" />
          Đối tác chiến lược
        </span>
      );
    case "startup":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
          <Sparkles className="h-2.5 w-2.5" />
          Startup
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[10px] font-medium text-stone-600 dark:text-stone-300">
          <User className="h-2.5 w-2.5" />
          Cá nhân
        </span>
      );
  }
}

export function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Đã duyệt & Cấp Client
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
          <XCircle className="h-3.5 w-3.5" />
          Từ chối Deal
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300 animate-pulse">
          <Clock className="h-3.5 w-3.5" />
          Chờ thẩm định
        </span>
      );
  }
}
