import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getR2BucketName } from "./r2-client";
import { getSupabaseAdminClient } from "./supabase";
import { getStoredApps, saveStoredApps } from "./storage-content";
import { type AppMetadata, getDefaultMetadata } from "./apps-repository";
import type { AppItem, AppDocPage, AppLegalDocument } from "@workspace/ui/lib/content-types";

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

export async function saveAppMetadataMap(map: Record<string, AppMetadata>): Promise<boolean> {
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

  const supabase = getSupabaseAdminClient();
  const metaMap = await fetchAppMetadataMap();
  const defaultMeta = metaMap[id] || getDefaultMetadata(app);

  // 1. Fetch Real Remote Config from Supabase
  let remoteConfig = defaultMeta.remoteConfig;
  try {
    const { data: rcData } = await supabase
      .from("app_remote_configs")
      .select("config, is_enabled")
      .eq("app_id", id)
      .maybeSingle();
    if (rcData?.config) {
      remoteConfig = {
        ...(rcData.config as Record<string, unknown>),
        enabled: rcData.is_enabled ?? true,
      };
    }
  } catch (err) {
    console.warn("Could not query app_remote_configs from Supabase:", err);
  }

  // 2. Fetch Real Permissions & Tailored Resources from Supabase
  let roles = defaultMeta.roles;
  let resources = defaultMeta.resources;
  let rolePermissions = defaultMeta.rolePermissions;
  try {
    const { data: permData } = await supabase
      .from("app_permissions")
      .select("roles, resources, role_permissions")
      .eq("app_id", id)
      .maybeSingle();
    if (permData) {
      if (Array.isArray(permData.roles) && permData.roles.length > 0) roles = permData.roles;
      if (Array.isArray(permData.resources) && permData.resources.length > 0) resources = permData.resources;
      if (permData.role_permissions && typeof permData.role_permissions === "object") {
        rolePermissions = permData.role_permissions;
      }
    }
  } catch (err) {
    console.warn("Could not query app_permissions from Supabase:", err);
  }

  // 3. Fetch Real MDX Docs Pages from Supabase
  let docsPages: AppDocPage[] = defaultMeta.docsPages;
  try {
    const { data: docsData } = await supabase
      .from("app_docs_pages")
      .select("slug, title, category, order_index, content, updated_at")
      .eq("app_id", id)
      .order("order_index", { ascending: true });
    if (docsData && docsData.length > 0) {
      docsPages = docsData.map((d) => ({
        slug: d.slug,
        title: d.title,
        category: d.category,
        order: d.order_index,
        content: d.content,
        updatedAt: d.updated_at,
      }));
    }
  } catch (err) {
    console.warn("Could not query app_docs_pages from Supabase:", err);
  }

  // 4. Fetch Real Legal Documents from Supabase
  let legalDocuments: AppLegalDocument[] = defaultMeta.legalDocuments;
  try {
    const { data: legalData } = await supabase
      .from("app_legal_docs")
      .select("slug, title, version, effective_date, content, updated_at")
      .eq("app_id", id);
    if (legalData && legalData.length > 0) {
      legalDocuments = legalData.map((l) => ({
        slug: l.slug,
        title: l.title,
        version: l.version,
        effectiveDate: l.effective_date,
        content: l.content,
        updatedAt: l.updated_at,
      }));
    }
  } catch (err) {
    console.warn("Could not query app_legal_docs from Supabase:", err);
  }

  return {
    ...app,
    clientId: defaultMeta.clientId,
    clientSecret: defaultMeta.clientSecret,
    redirectUris: defaultMeta.redirectUris,
    isInternal: defaultMeta.isInternal,
    roles,
    resources,
    rolePermissions,
    docsPages,
    legalDocuments,
    docsMdx: docsPages?.[0]?.content || "",
    remoteConfig,
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
  const supabase = getSupabaseAdminClient();

  // 1. Save Remote Config to Supabase
  if (app.remoteConfig) {
    const isEnabled = (app.remoteConfig as any).enabled !== false;
    await supabase.from("app_remote_configs").upsert([
      {
        app_id: app.id,
        config: app.remoteConfig,
        is_enabled: isEnabled,
        updated_at: new Date().toISOString(),
      },
    ]);
  }

  // 2. Save Permissions & Resources to Supabase
  if (app.roles || app.resources || app.rolePermissions) {
    await supabase.from("app_permissions").upsert([
      {
        app_id: app.id,
        roles: app.roles || [],
        resources: app.resources || [],
        role_permissions: app.rolePermissions || {},
        updated_at: new Date().toISOString(),
      },
    ]);
  }

  // 3. Save Docs Pages to Supabase
  if (app.docsPages && app.docsPages.length > 0) {
    const docsRecords = app.docsPages.map((p, pIdx) => ({
      id: `${app.id}:${p.slug}`,
      app_id: app.id,
      slug: p.slug,
      title: p.title,
      category: p.category || "Tài liệu",
      order_index: p.order || pIdx + 1,
      content: p.content,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from("app_docs_pages").upsert(docsRecords);
  }

  // 4. Save Legal Docs to Supabase
  if (app.legalDocuments && app.legalDocuments.length > 0) {
    const legalRecords = app.legalDocuments.map((l) => ({
      id: `${app.id}:${l.slug}`,
      app_id: app.id,
      slug: l.slug,
      title: l.title,
      version: l.version || "1.0",
      effective_date: l.effectiveDate || "01/11/2026",
      content: l.content,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from("app_legal_docs").upsert(legalRecords);
  }

  // 5. Update R2 metadata map (warm backup)
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

  // 6. Sync to oauth_clients table in Supabase
  await syncOAuthClientRecord(app);

  return true;
}
