/**
 * Suy ra cookie domain cho SSO multi-subdomain.
 * - Deploy trên custom domain (ví dụ *.vntez.cloud): share cookie ".vntez.cloud".
 * - Lưu ý: Trên vercel.app (Public Suffix List), cookie không được phép đặt cho ".vercel.app"
 *   nên ta để undefined để cookie bind trực tiếp vào host hiện tại (vntez-id.vercel.app).
 * - Dev (localhost): trả undefined -> cookie bind host hiện tại.
 */
export function cookieDomain(host?: string | null): string | undefined {
  if (host) {
    const cleanHost = host.split(":")[0];
    if (cleanHost.endsWith(".vntez.cloud")) return ".vntez.cloud";
    if (cleanHost.endsWith(".vntez.com")) return ".vntez.com";
    if (cleanHost.endsWith(".povixa.cloud")) return ".povixa.cloud";
    return undefined;
  }
  if (typeof window === "undefined") {
    const site = process.env.NEXT_PUBLIC_SITE_URL || "";
    if (site.includes(".vntez.cloud")) return ".vntez.cloud";
    if (site.includes(".vntez.com")) return ".vntez.com";
    if (site.includes(".povixa.cloud")) return ".povixa.cloud";
    return undefined;
  }
  const hostname = window.location.hostname;
  if (hostname.endsWith(".vntez.cloud")) return ".vntez.cloud";
  if (hostname.endsWith(".vntez.com")) return ".vntez.com";
  if (hostname.endsWith(".povixa.cloud")) return ".povixa.cloud";
  return undefined;
}
