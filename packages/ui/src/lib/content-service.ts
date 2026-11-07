import type { AppItem, BlogPostItem } from "./content-types.js";

export const R2_WORKER_BASE =
  process.env.R2_UPLOAD_WORKER_URL || "https://upload.hnamhocit.workers.dev";

async function getR2SignedUrl(key: string): Promise<string | null> {
  try {
    const res = await fetch(`${R2_WORKER_BASE}/api/upload/signed-download-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, expiresIn: 3600 }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.downloadUrl || null;
  } catch (err) {
    console.error(`Failed to get R2 signed url for ${key}:`, err);
    return null;
  }
}

export async function fetchLiveApps(): Promise<AppItem[]> {
  try {
    const signedUrl = await getR2SignedUrl("apps.json");
    if (signedUrl) {
      const res = await fetch(signedUrl, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data;
        }
      }
    }
  } catch (err) {
    console.warn("Error fetching apps from R2:", err);
  }
  return [];
}

export async function fetchLiveBlogPosts(): Promise<BlogPostItem[]> {
  try {
    const signedUrl = await getR2SignedUrl("blog_posts.json");
    if (signedUrl) {
      const res = await fetch(signedUrl, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data;
        }
      }
    }
  } catch (err) {
    console.warn("Error fetching blog posts from R2:", err);
  }
  return [];
}

export async function fetchLiveBlogPostBySlug(slug: string): Promise<BlogPostItem | null> {
  const posts = await fetchLiveBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}
