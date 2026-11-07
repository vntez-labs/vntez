/**
 * Helper to resolve the Web Portal URL (https://vntez.vercel.app or localhost:3002)
 */
export function getPortalBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_PORTAL_URL) {
    return process.env.NEXT_PUBLIC_PORTAL_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_WEB_URL) {
    return process.env.NEXT_PUBLIC_WEB_URL.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const { hostname } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:3002";
    }
    if (hostname.includes("vntez-console.vercel.app")) {
      return "https://vntez.vercel.app";
    }
  }

  return "https://vntez.vercel.app";
}

export function getPublicBlogPostUrl(slug: string): string {
  const base = getPortalBaseUrl();
  return `${base}/blog/${encodeURIComponent(slug)}`;
}

export function getDocsBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_DOCS_URL) {
    return process.env.NEXT_PUBLIC_DOCS_URL.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const { hostname } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:3004";
    }
  }

  return "https://vntez-docs.vercel.app";
}
