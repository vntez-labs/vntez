import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getR2BucketName } from "./r2-client";

/**
 * Safely extracts R2 Object Key from a URL or key string.
 * Enforces security whitelist: only keys in avatars/, thumbnails/, uploads/ are allowed.
 * Prevents accidental deletion of critical files like apps.json or blog_posts.json.
 */
export function extractR2KeyFromUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;

  try {
    let rawKey = "";

    if (url.startsWith("http://") || url.startsWith("https://")) {
      const parsed = new URL(url);
      const queryKey = parsed.searchParams.get("key");

      if (queryKey) {
        rawKey = queryKey;
      } else {
        const bucket = getR2BucketName();
        let pathname = decodeURIComponent(parsed.pathname).replace(/^\/+/, "");
        if (pathname.startsWith(`${bucket}/`)) {
          pathname = pathname.slice(bucket.length + 1);
        }
        rawKey = pathname;
      }
    } else {
      rawKey = decodeURIComponent(url).replace(/^\/+/, "");
    }

    // Safety check: only allow purging from asset folders
    if (/^(avatars|thumbnails|uploads)\/.+/.test(rawKey)) {
      return rawKey;
    }

    return null;
  } catch (err) {
    console.error("Failed to parse R2 key from URL:", url, err);
    return null;
  }
}

/**
 * Deletes an orphaned asset from Cloudflare R2 bucket.
 */
export async function deleteR2AssetByKey(key?: string | null): Promise<boolean> {
  if (!key) return false;

  // Enforce safety boundary: protect system files
  if (!/^(avatars|thumbnails|uploads)\/.+/.test(key)) {
    console.warn(`[R2 GC] Skipped deletion for protected or invalid key: ${key}`);
    return false;
  }

  try {
    const s3 = getR2Client();
    const bucket = getR2BucketName();

    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    console.log(`[R2 GC] Successfully purged orphaned asset: ${key}`);
    return true;
  } catch (err) {
    console.error(`[R2 GC] Failed to delete asset ${key} from R2:`, err);
    return false;
  }
}

/**
 * Deletes an asset from Cloudflare R2 given its public/signed URL.
 */
export async function deleteR2AssetByUrl(url?: string | null): Promise<boolean> {
  const key = extractR2KeyFromUrl(url);
  if (!key) return false;
  return deleteR2AssetByKey(key);
}
