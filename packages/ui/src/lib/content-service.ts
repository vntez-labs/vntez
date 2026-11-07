import type { AppItem, BlogPostItem } from "./content-types.js";

export const R2_WORKER_BASE =
  process.env.R2_UPLOAD_WORKER_URL || "https://upload.hnamhocit.workers.dev";

const SUPABASE_REST_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://stbswcnsitztbusqrdhi.supabase.co";

const SUPABASE_REST_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "sb_publishable_Pjw68YY4m28WZaTUgiT17A_LZUhMGLx";

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
  // 1. Fetch real apps directly from Supabase Postgres REST API
  try {
    const res = await fetch(`${SUPABASE_REST_URL}/rest/v1/apps?select=*&order=created_at.desc`, {
      headers: {
        apikey: SUPABASE_REST_KEY,
        Authorization: `Bearer ${SUPABASE_REST_KEY}`,
      },
      cache: "no-store",
    });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          name: String(r.name || ""),
          category: String(r.category || ""),
          description: String(r.description || ""),
          releaseDate: typeof r.release_date === "string" ? r.release_date : undefined,
          platforms: Array.isArray(r.platforms) ? r.platforms.map(String) : [],
          color: typeof r.color === "string" ? r.color : "#fb291a",
          ctaLink: typeof r.cta_link === "string" ? r.cta_link : `/docs/${r.id}`,
          avatarUrl: typeof r.avatar_url === "string" ? r.avatar_url : null,
          illustrationKey: (r.illustration_key as AppItem["illustrationKey"]) || "ecosystem",
          status: (r.status as AppItem["status"]) || "active",
          updatedAt: typeof r.updated_at === "string" ? r.updated_at : new Date().toISOString(),
        }));
      }
    }
  } catch (err) {
    console.warn("Error fetching apps from Supabase REST:", err);
  }

  // 2. Fall back to Cloudflare R2
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
  // 1. Fetch real blog posts directly from Supabase Postgres REST API
  try {
    const res = await fetch(`${SUPABASE_REST_URL}/rest/v1/blog_posts?select=*&order=created_at.desc`, {
      headers: {
        apikey: SUPABASE_REST_KEY,
        Authorization: `Bearer ${SUPABASE_REST_KEY}`,
      },
      cache: "no-store",
    });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          slug: String(r.slug),
          title: String(r.title || ""),
          excerpt: String(r.excerpt || ""),
          content: String(r.content || ""),
          category: String(r.category || ""),
          color: typeof r.color === "string" ? r.color : "#fb291a",
          author: String(r.author || ""),
          date: String(r.date || ""),
          readTime: String(r.read_time || "5 phút đọc"),
          commentsCount: typeof r.comments_count === "number" ? r.comments_count : 0,
          likesCount: typeof r.likes_count === "number" ? r.likes_count : 0,
          viewsCount: typeof r.views_count === "number" ? r.views_count : 0,
          illustrationKey: typeof r.illustration_key === "string" ? r.illustration_key : undefined,
          thumbnailUrl: typeof r.thumbnail_url === "string" ? r.thumbnail_url : undefined,
          status: (r.status as BlogPostItem["status"]) || "published",
          comments: Array.isArray(r.comments) ? (r.comments as BlogPostItem["comments"]) : [],
          updatedAt: typeof r.updated_at === "string" ? r.updated_at : new Date().toISOString(),
        }));
      }
    }
  } catch (err) {
    console.warn("Error fetching blog posts from Supabase REST:", err);
  }

  // 2. Fall back to Cloudflare R2
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
