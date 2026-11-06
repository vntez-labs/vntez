import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let r2ClientInstance: S3Client | null = null;

export function getR2Client(): S3Client {
  if (r2ClientInstance) return r2ClientInstance;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const endpoint =
    process.env.R2_ENDPOINT ||
    (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing required R2 credentials: R2_ENDPOINT (or R2_ACCOUNT_ID), R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY"
    );
  }

  r2ClientInstance = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return r2ClientInstance;
}

export function getR2BucketName(): string {
  return process.env.R2_BUCKET_NAME || "vntez-bucket";
}

export function getR2UploadWorkerUrl(): string {
  return process.env.R2_UPLOAD_WORKER_URL || "https://upload.hnamhocit.workers.dev";
}

export async function getR2SignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  const s3 = getR2Client();
  const bucket = getR2BucketName();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return getSignedUrl(s3, command, {
    expiresIn: Math.min(expiresIn, 604800),
  });
}
