import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getR2BucketName, getR2SignedDownloadUrl } from "./r2-client";
import type { AppItem, BlogPostItem } from "@workspace/ui/lib/content-types";

export async function getStoredApps(): Promise<AppItem[]> {
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
        Metadata: {
          "entity-id": entityId || "common",
          "uploaded-at": new Date().toISOString(),
          "original-name": encodeURIComponent(file.name.slice(0, 50)),
        },
      })
    );

    // Generate signed download URL (valid 7 days)
    return await getR2SignedDownloadUrl(key, 604800);
  } catch (err) {
    console.error(`Error uploading to R2 ${folder}:`, err);
    return null;
  }
}
