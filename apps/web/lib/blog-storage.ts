import type { BlogPostItem, BlogComment } from "@workspace/ui/lib/content-types";

const STORAGE_URL =
  "https://stbswcnsitztbusqrdhi.supabase.co/storage/v1/object/vntez-assets/blog_posts.json";
const PUBLIC_STORAGE_URL =
  "https://stbswcnsitztbusqrdhi.supabase.co/storage/v1/object/public/vntez-assets/blog_posts.json";

function getServiceKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0YnN3Y25zaXR6dGJ1c3FyZGhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDI1Mjc2MywiZXhwIjoyMTA1ODI4NzYzfQ.ag_TagaE5fe6hor21fPbr5abVr0LD3YahygwFJVjwlw"
  );
}

export async function getLiveBlogPosts(): Promise<BlogPostItem[]> {
  try {
    const res = await fetch(PUBLIC_STORAGE_URL, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error reading live blog posts:", err);
    return [];
  }
}

export async function saveLiveBlogPosts(posts: BlogPostItem[]): Promise<boolean> {
  try {
    const key = getServiceKey();
    const res = await fetch(STORAGE_URL, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "x-upsert": "true",
      },
      body: JSON.stringify(posts, null, 2),
    });
    return res.ok;
  } catch (err) {
    console.error("Error saving live blog posts:", err);
    return false;
  }
}

export async function incrementView(slug: string): Promise<number> {
  const posts = await getLiveBlogPosts();
  const target = posts.find((p) => p.slug === slug);
  if (!target) return 0;

  target.viewsCount = (target.viewsCount || 0) + 1;
  await saveLiveBlogPosts(posts);
  return target.viewsCount;
}

export async function incrementLike(slug: string): Promise<number> {
  const posts = await getLiveBlogPosts();
  const target = posts.find((p) => p.slug === slug);
  if (!target) return 0;

  target.likesCount = (target.likesCount || 0) + 1;
  await saveLiveBlogPosts(posts);
  return target.likesCount;
}

export async function addComment(
  slug: string,
  author: string,
  content: string
): Promise<{ comment: BlogComment; count: number } | null> {
  const posts = await getLiveBlogPosts();
  const target = posts.find((p) => p.slug === slug);
  if (!target) return null;

  const newComment: BlogComment = {
    id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    author: author.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  if (!Array.isArray(target.comments)) {
    target.comments = [];
  }
  target.comments.unshift(newComment);
  target.commentsCount = target.comments.length;

  await saveLiveBlogPosts(posts);
  return { comment: newComment, count: target.commentsCount };
}
