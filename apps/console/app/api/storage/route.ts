import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import {
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import {
  getR2Client,
  getR2BucketName,
  getR2SignedDownloadUrl,
} from "@/lib/r2-client";
import type { R2FileItem, StorageMetrics } from "@/app/storage/storage-types";

const STORAGE_LIMIT_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB Free Tier

function inferMimeType(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "json":
      return "application/json";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "svg":
      return "image/svg+xml";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "pdf":
      return "application/pdf";
    case "txt":
    case "md":
      return "text/plain";
    case "zip":
      return "application/zip";
    default:
      return "application/octet-stream";
  }
}

export async function GET(req: Request) {
  try {
    const s3 = getR2Client();
    const bucket = getR2BucketName();
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    // If specific key requested, return presigned download URL
    if (key) {
      const downloadUrl = await getR2SignedDownloadUrl(key, 3600);
      return NextResponse.json({ success: true, downloadUrl, key });
    }

    // List all R2 objects in bucket
    const listRes = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
      })
    );

    const contents = listRes.Contents || [];
    const files: R2FileItem[] = await Promise.all(
      contents
        .filter((item) => item.Key && !item.Key.endsWith("/"))
        .map(async (item) => {
          const fileKey = item.Key!;
          const downloadUrl = await getR2SignedDownloadUrl(fileKey, 3600);
          return {
            key: fileKey,
            size: item.Size || 0,
            uploaded_at: item.LastModified?.toISOString() || new Date().toISOString(),
            content_type: inferMimeType(fileKey),
            download_url: downloadUrl,
          };
        })
    );

    const totalBytes = files.reduce((acc, f) => acc + f.size, 0);

    const metrics: StorageMetrics = {
      total_bytes: totalBytes,
      total_files: files.length,
      storage_limit_bytes: STORAGE_LIMIT_BYTES,
      bandwidth_egress_bytes: 0, // R2 has $0 egress fee
      monthly_operations: {
        class_a: 10 + files.length,
        class_b: 40 + files.length * 2,
      },
    };

    return NextResponse.json({ success: true, files, metrics });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load R2 storage files";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const s3 = getR2Client();
    const bucket = getR2BucketName();
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const cleanFolder = folder.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/^\/+|\/+$/g, "");
    const key = cleanFolder ? `${cleanFolder}/${Date.now()}-${cleanName}` : `${Date.now()}-${cleanName}`;

    const arrayBuffer = await file.arrayBuffer();

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: Buffer.from(arrayBuffer),
        ContentType: file.type || "application/octet-stream",
      })
    );

    const downloadUrl = await getR2SignedDownloadUrl(key, 3600);

    const newFile: R2FileItem = {
      key,
      size: file.size,
      uploaded_at: new Date().toISOString(),
      content_type: file.type || "application/octet-stream",
      download_url: downloadUrl,
    };

    return NextResponse.json({ success: true, file: newFile });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Upload to R2 storage failed";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
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

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Delete from R2 failed";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
