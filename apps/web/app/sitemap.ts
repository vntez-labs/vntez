import type { MetadataRoute } from "next";
import { fetchLiveBlogPosts } from "@workspace/ui/lib/content-service";
import { APP_FILTERS } from "./docs/docs-data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://vntez.net";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Dynamic docs routes
  const docsRoutes: MetadataRoute.Sitemap = APP_FILTERS.map((app) => ({
    url: `${baseUrl}/docs/${app.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Dynamic live blog routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const livePosts = await fetchLiveBlogPosts();
    blogRoutes = livePosts
      .filter((post) => post.status !== "draft")
      .map((post) => {
        let postDate = now;
        try {
          if (post.updatedAt) postDate = new Date(post.updatedAt);
          else if (post.date) postDate = new Date(post.date);
        } catch {
          postDate = now;
        }

        return {
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: postDate,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        };
      });
  } catch (err) {
    console.warn("Failed to generate dynamic blog sitemap:", err);
  }

  return [...staticRoutes, ...docsRoutes, ...blogRoutes];
}
