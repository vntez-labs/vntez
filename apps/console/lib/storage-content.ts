import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getR2BucketName, getR2SignedDownloadUrl } from "./r2-client";
import { getSupabaseAdminClient } from "./supabase";
import type { AppItem, BlogPostItem } from "@workspace/ui/lib/content-types";

export async function getStoredApps(): Promise<AppItem[]> {
  // 1. Try Supabase Postgres table first
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("apps")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        description: r.description,
        releaseDate: r.release_date,
        platforms: r.platforms || [],
        color: r.color,
        ctaLink: r.cta_link,
        avatarUrl: r.avatar_url,
        illustrationKey: r.illustration_key,
        status: r.status,
        updatedAt: r.updated_at || new Date().toISOString(),
      }));
    }
  } catch {
    // Fall back to R2 if table not created
  }

  // 2. Fall back to Cloudflare R2
  try {
    const s3 = getR2Client();
    const bucket = getR2BucketName();
    const res = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: "apps.json",
      })
    );
    const text = await res.Body?.transformToString();
    if (!text) return [];
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error fetching stored apps from R2:", err);
    return [];
  }
}

export async function saveStoredApps(apps: AppItem[]): Promise<boolean> {
  // 1. Try syncing to Supabase Postgres
  try {
    const supabase = getSupabaseAdminClient();
    if (apps.length > 0) {
      const records = apps.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        description: a.description,
        release_date: a.releaseDate,
        platforms: a.platforms || [],
        color: a.color,
        cta_link: a.ctaLink,
        avatar_url: a.avatarUrl,
        illustration_key: a.illustrationKey,
        status: a.status,
        updated_at: new Date().toISOString(),
      }));
      await supabase.from("apps").upsert(records);
    }
  } catch {
    // Non-fatal if table not created yet
  }

  // 2. Persist to Cloudflare R2
  try {
    const s3 = getR2Client();
    const bucket = getR2BucketName();
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: "apps.json",
        Body: Buffer.from(JSON.stringify(apps, null, 2)),
        ContentType: "application/json",
      })
    );
    return true;
  } catch (err) {
    console.error("Error saving stored apps to R2:", err);
    return false;
  }
}

export async function getStoredBlogPosts(): Promise<BlogPostItem[]> {
  // 1. Try Supabase Postgres table first
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((r) => ({
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        content: r.content,
        category: r.category,
        color: r.color,
        author: r.author,
        date: r.date,
        readTime: r.read_time,
        commentsCount: r.comments_count || 0,
        likesCount: r.likes_count || 0,
        viewsCount: r.views_count || 0,
        illustrationKey: r.illustration_key,
        thumbnailUrl: r.thumbnail_url,
        status: r.status,
        comments: r.comments || [],
        updatedAt: r.updated_at || new Date().toISOString(),
      }));
    }
  } catch {
    // Fall back to R2
  }

  // 2. Fall back to Cloudflare R2
  try {
    const s3 = getR2Client();
    const bucket = getR2BucketName();
    const res = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: "blog_posts.json",
      })
    );
    const text = await res.Body?.transformToString();
    if (!text) return [];
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error fetching stored blog posts from R2:", err);
    return [];
  }
}

export async function saveStoredBlogPosts(posts: BlogPostItem[]): Promise<boolean> {
  // 1. Try syncing to Supabase Postgres
  try {
    const supabase = getSupabaseAdminClient();
    if (posts.length > 0) {
      const records = posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        category: p.category,
        color: p.color,
        author: p.author,
        date: p.date,
        read_time: p.readTime,
        comments_count: p.commentsCount || 0,
        likes_count: p.likesCount || 0,
        views_count: p.viewsCount || 0,
        illustration_key: p.illustrationKey,
        thumbnail_url: p.thumbnailUrl,
        status: p.status,
        comments: p.comments || [],
        updated_at: new Date().toISOString(),
      }));
      await supabase.from("blog_posts").upsert(records);
    }
  } catch {
    // Non-fatal if table not created yet
  }

  // 2. Persist to Cloudflare R2
  try {
    const s3 = getR2Client();
    const bucket = getR2BucketName();
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: "blog_posts.json",
        Body: Buffer.from(JSON.stringify(posts, null, 2)),
        ContentType: "application/json",
      })
    );
    return true;
  } catch (err) {
    console.error("Error saving stored blog posts to R2:", err);
    return false;
  }
}

export async function uploadAssetFile(
  folder: "avatars" | "thumbnails",
  file: File,
  entityId?: string | null
): Promise<string | null> {
  try {
    const s3 = getR2Client();
    const bucket = getR2BucketName();
    const ext = file.name.split(".").pop() || "png";
    const cleanName = file.name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 20);
    const key = entityId
      ? `${folder}/apps/${entityId}/${Date.now()}_${cleanName}.${ext}`
      : `${folder}/${Date.now()}_${cleanName}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: Buffer.from(arrayBuffer),
        ContentType: file.type || "image/png",
      })
    );

    return await getR2SignedDownloadUrl(key, 604800);
  } catch (err) {
    console.error("Error uploading asset to R2:", err);
    return null;
  }
}
