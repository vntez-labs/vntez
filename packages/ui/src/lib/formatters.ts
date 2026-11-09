/**
 * Standard utility formatters for VNTEZ Ecosystem.
 * Uses browser-native Intl APIs for optimal performance and zero bundle overhead.
 */

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB", "PB"] as const;

/**
 * Formats a number of bytes into a human-readable string (e.g. 1.5 MB, 10 GB).
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  if (!bytes || isNaN(bytes)) return "—";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const unitIndex = Math.min(i, BYTE_UNITS.length - 1);

  return `${parseFloat((bytes / Math.pow(k, unitIndex)).toFixed(dm))} ${BYTE_UNITS[unitIndex]}`;
}

/**
 * Formats an ISO date string into Vietnamese locale format.
 * E.g. "09/11/2026" or "09/11/2026, 08:30"
 */
export function formatDate(
  dateStr?: string | number | Date | null,
  includeTime = false
): string {
  if (!dateStr) return "Chưa cập nhật";

  const date = typeof dateStr === "object" ? dateStr : new Date(dateStr);
  if (isNaN(date.getTime())) return "Chưa cập nhật";

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(includeTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
  });
}

/**
 * Formats a date relative to now (e.g. "vừa xong", "5 phút trước", "3 ngày trước").
 */
export function formatRelativeTime(dateStr?: string | number | Date | null): string {
  if (!dateStr) return "Chưa cập nhật";

  const date = typeof dateStr === "object" ? dateStr : new Date(dateStr);
  if (isNaN(date.getTime())) return "Chưa cập nhật";

  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return "vừa xong";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;
  if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)} ngày trước`;
  if (diffSec < 31536000) return `${Math.floor(diffSec / 2592000)} tháng trước`;
  return `${Math.floor(diffSec / 31536000)} năm trước`;
}

/**
 * Formats a number with thousands separators (e.g. 1,234,567).
 */
export function formatNumber(num: number): string {
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("vi-VN").format(num);
}
