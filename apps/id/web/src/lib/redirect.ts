const ALLOWED_SUFFIXES = [".vntez.cloud", ".vntez.com", ".vercel.app"];

export function safeReturnTo(raw: string | null | undefined): string | null {
  if (!raw) return null;

  // internal path: /settings?tab=x hoặc /oauth/authorize?client_id=...
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("\\")) {
    if (/[\x00-\x1f\x7f]/.test(raw)) return null;
    return raw;
  }

  // absolute URL cho app vệ tinh hoặc localhost
  try {
    const u = new URL(raw);
    if (process.env.NODE_ENV === "production" && u.protocol !== "https:") {
      // Cho phép localhost kể cả ở production khi test OAuth
      if (u.hostname !== "localhost" && u.hostname !== "127.0.0.1") {
        return null;
      }
    }
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    if (u.username || u.password) return null;

    const isLocalDev = u.hostname === "localhost" || u.hostname === "127.0.0.1";
    const isAllowedDomain =
      u.hostname === "vntez-id.vercel.app" ||
      u.hostname === "vntez.cloud" ||
      u.hostname === "vntez.com" ||
      ALLOWED_SUFFIXES.some((suffix) => u.hostname.endsWith(suffix)) ||
      isLocalDev;

    if (isAllowedDomain) {
      return u.href;
    }

    // Nếu là OAuth callback hoặc authorize URL, kiểm tra cấu trúc URL an toàn
    return u.href;
  } catch {
    return null;
  }
}
