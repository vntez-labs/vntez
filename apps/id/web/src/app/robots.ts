import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://vntez-id.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/developers", "/terms", "/privacy"],
        disallow: ["/auth/", "/oauth/", "/.well-known/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
