import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getR2BucketName } from "./r2-client";
import { getSupabaseAdminClient } from "./supabase";
import { getStoredApps, saveStoredApps } from "./storage-content";
import {
  type AppMetadata,
  getDefaultMetadata,
} from "./apps-repository";
import type { AppItem } from "@workspace/ui/lib/content-types";

const META_STORAGE_KEY = "apps_meta.json";

export async function fetchAppMetadataMap(): Promise<Record<string, AppMetadata>> {
  try {
    const s3 = getR2Client();
    const bucket = getR2BucketName();
    const res = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: META_STORAGE_KEY,
      })
    );
    const text = await res.Body?.transformToString();
    if (!text) return {};
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export async function saveAppMetadataMap(
  map: Record<string, AppMetadata>
): Promise<boolean> {
  try {
    const s3 = getR2Client();
    const bucket = getR2BucketName();
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: META_STORAGE_KEY,
        Body: Buffer.from(JSON.stringify(map, null, 2)),
        ContentType: "application/json",
      })
    );
    return true;
  } catch (err) {
    console.error("Failed to save apps_meta to R2:", err);
    return false;
  }
}

export async function getFullAppWorkspace(id: string): Promise<AppItem | null> {
  const apps = await getStoredApps();
  const app = apps.find((a) => a.id === id);
  if (!app) return null;

  const metaMap = await fetchAppMetadataMap();
  const meta = metaMap[id] || getDefaultMetadata(app);

  return {
    ...app,
    clientId: meta.clientId,
    clientSecret: meta.clientSecret,
    redirectUris: meta.redirectUris,
    isInternal: meta.isInternal,
    roles: meta.roles,
    resources: meta.resources,
    rolePermissions: meta.rolePermissions,
    docsPages: meta.docsPages,
    legalDocuments: meta.legalDocuments,
    docsMdx: meta.docsPages?.[0]?.content || "",
    remoteConfig: meta.remoteConfig,
  };
}

export async function syncOAuthClientRecord(app: AppItem): Promise<void> {
  try {
    const supabase = getSupabaseAdminClient();
    const clientId = app.clientId || `vntez_${app.id.replace(/-/g, "_")}`;

    const record = {
      client_id: clientId,
      name: app.name,
      description: app.description || null,
      redirect_uris: app.redirectUris && app.redirectUris.length > 0
        ? app.redirectUris
        : [`https://${app.id}.vntez.net/auth/callback`],
      logo_url: app.avatarUrl || null,
      is_internal: app.isInternal !== undefined ? app.isInternal : true,
    };

    await supabase.from("oauth_clients").upsert([record]);
  } catch (err) {
    console.warn("Could not sync OAuth Client to Supabase table:", err);
  }
}

export async function saveFullAppWorkspace(app: AppItem): Promise<boolean> {
  const apps = await getStoredApps();
  const idx = apps.findIndex((a) => a.id === app.id);
  const updatedApps = [...apps];

  if (idx >= 0) {
    updatedApps[idx] = { ...updatedApps[idx], ...app };
  } else {
    updatedApps.unshift(app);
  }

  await saveStoredApps(updatedApps);

  // Update R2 metadata map
  const metaMap = await fetchAppMetadataMap();
  metaMap[app.id] = {
    clientId: app.clientId || `vntez_${app.id.replace(/-/g, "_")}`,
    clientSecret: app.clientSecret || "vsec_placeholder",
    redirectUris: app.redirectUris || [],
    isInternal: Boolean(app.isInternal),
    roles: app.roles || [],
    resources: app.resources || [],
    rolePermissions: app.rolePermissions || {},
    docsPages: app.docsPages || [],
    legalDocuments: app.legalDocuments || [],
    remoteConfig: app.remoteConfig || {},
  };
  await saveAppMetadataMap(metaMap);

  // Sync to oauth_clients table in Supabase
  await syncOAuthClientRecord(app);

  return true;
}
