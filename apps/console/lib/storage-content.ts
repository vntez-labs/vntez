import { getSupabaseAdminClient } from "@/lib/supabase";
import type { AppItem, BlogPostItem } from "@workspace/ui/lib/content-types";

const BUCKET = "vntez-assets";

export async function getStoredApps(): Promise<AppItem[]> {
  try {
    const sb = getSupabaseAdminClient();
    const res = await sb.storage.from(BUCKET).download("apps.json");
    if (res.error) throw res.error;
    const text = await res.data.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error fetching stored apps:", err);
    return [];
  }
}

export async function saveStoredApps(apps: AppItem[]): Promise<boolean> {
  try {
    const sb = getSupabaseAdminClient();
    const { error } = await sb.storage.from(BUCKET).upload(
      "apps.json",
      JSON.stringify(apps, null, 2),
      { upsert: true, contentType: "application/json" }
    );
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error saving stored apps:", err);
    return false;
  }
}

export async function getStoredBlogPosts(): Promise<BlogPostItem[]> {
  try {
    const sb = getSupabaseAdminClient();
    const res = await sb.storage.from(BUCKET).download("blog_posts.json");
    if (res.error) throw res.error;
    const text = await res.data.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error fetching stored blog posts:", err);
    return [];
  }
}

export async function saveStoredBlogPosts(posts: BlogPostItem[]): Promise<boolean> {
  try {
    const sb = getSupabaseAdminClient();
    const { error } = await sb.storage.from(BUCKET).upload(
      "blog_posts.json",
      JSON.stringify(posts, null, 2),
      { upsert: true, contentType: "application/json" }
    );
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error saving stored blog posts:", err);
    return false;
  }
}

export async function uploadAssetFile(
  folder: "avatars" | "thumbnails",
  file: File
): Promise<string | null> {
  try {
    const sb = getSupabaseAdminClient();
    const ext = file.name.split(".").pop() || "png";
    const cleanName = file.name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 20);
    const path = `${folder}/${Date.now()}_${cleanName}.${ext}`;

    const { error } = await sb.storage.from(BUCKET).upload(path, file, {
      upsert: true,
      contentType: file.type || "image/png",
    });
    if (error) throw error;

    const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error(`Error uploading to ${folder}:`, err);
    return null;
  }
}
