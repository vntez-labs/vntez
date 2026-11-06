import type { AppItem, BlogPostItem } from "./content-types.js";

export const CONTENT_STORAGE_BASE =
  "https://stbswcnsitztbusqrdhi.supabase.co/storage/v1/object/public/vntez-assets";

export async function fetchLiveApps(): Promise<AppItem[]> {
  try {
    const res = await fetch(`${CONTENT_STORAGE_BASE}/apps.json`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn("Using fallback apps data:", err);
  }
  return [];
}

export async function fetchLiveBlogPosts(): Promise<BlogPostItem[]> {
  try {
    const res = await fetch(`${CONTENT_STORAGE_BASE}/blog_posts.json`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn("Using fallback blog posts data:", err);
  }
  return [];
}

export async function fetchLiveBlogPostBySlug(slug: string): Promise<BlogPostItem | null> {
  const posts = await fetchLiveBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}
