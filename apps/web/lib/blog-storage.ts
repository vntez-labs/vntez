import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import type { BlogPostItem, BlogComment } from "@workspace/ui/lib/content-types";

let r2Client: S3Client | null = null;

function getClient(): S3Client {
  if (r2Client) return r2Client;
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const endpoint =
    process.env.R2_ENDPOINT ||
    (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing required R2 environment variables (R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)"
    );
  }

  r2Client = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  return r2Client;
}

const BUCKET = process.env.R2_BUCKET_NAME || "vntez-bucket";

export async function getLiveBlogPosts(): Promise<BlogPostItem[]> {
  try {
    const s3 = getClient();
    const res = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: "blog_posts.json",
      })
    );
    const text = await res.Body?.transformToString();
    if (!text) return [];
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error reading live blog posts from R2:", err);
    return [];
  }
}

export async function saveLiveBlogPosts(posts: BlogPostItem[]): Promise<boolean> {
  try {
    const s3 = getClient();
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: "blog_posts.json",
        Body: Buffer.from(JSON.stringify(posts, null, 2)),
        ContentType: "application/json",
      })
    );
    return true;
  } catch (err) {
    console.error("Error saving live blog posts to R2:", err);
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

export async function toggleLike(
  slug: string,
  action: "like" | "unlike" = "like"
): Promise<number> {
  const posts = await getLiveBlogPosts();
  const target = posts.find((p) => p.slug === slug);
  if (!target) return 0;

  if (action === "unlike") {
    target.likesCount = Math.max(0, (target.likesCount || 0) - 1);
  } else {
    target.likesCount = (target.likesCount || 0) + 1;
  }

  await saveLiveBlogPosts(posts);
  return target.likesCount;
}

export async function incrementLike(slug: string): Promise<number> {
  return toggleLike(slug, "like");
}

export async function addComment(
  slug: string,
  author: string,
  content: string,
  parentId?: string | null,
  replyToAuthor?: string,
  avatar?: string
): Promise<{ comment: BlogComment; count: number } | null> {
  const posts = await getLiveBlogPosts();
  const target = posts.find((p) => p.slug === slug);
  if (!target) return null;

  const newComment: BlogComment = {
    id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    parentId: parentId || null,
    replyToAuthor: replyToAuthor?.trim() || undefined,
    author: author.trim(),
    avatar: avatar?.trim() || undefined,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    likesCount: 0,
  };

  if (!Array.isArray(target.comments)) {
    target.comments = [];
  }
  target.comments.unshift(newComment);
  target.commentsCount = target.comments.length;

  await saveLiveBlogPosts(posts);
  return { comment: newComment, count: target.commentsCount };
}

export async function deleteComment(
  slug: string,
  commentId: string
): Promise<{ success: boolean; count: number }> {
  const posts = await getLiveBlogPosts();
  const target = posts.find((p) => p.slug === slug);
  if (!target) return { success: false, count: 0 };

  const idsToDelete = new Set<string>([commentId]);
  (target.comments || []).forEach((c) => {
    if (c.parentId && idsToDelete.has(c.parentId)) {
      idsToDelete.add(c.id);
    }
  });

  target.comments = (target.comments || []).filter((c) => !idsToDelete.has(c.id));
  target.commentsCount = target.comments.length;

  await saveLiveBlogPosts(posts);
  return { success: true, count: target.commentsCount };
}
