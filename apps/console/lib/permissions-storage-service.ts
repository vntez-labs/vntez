import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getR2BucketName } from "./r2-client";
import {
  STANDARD_RESOURCES,
  STANDARD_ACTIONS,
  ROOT_DEFAULT_ROLES,
  INITIAL_ROLE_PERMISSIONS,
} from "@/app/permissions/permissions-constants";
import type { RoleDefinition } from "@/app/permissions/permissions-types";

const ROOT_PERMISSIONS_STORAGE_KEY = "root_iam_matrix.json";

export interface StoredPermissionsMatrix {
  resources: string[];
  actions: string[];
  roles: RoleDefinition[];
  rolePermissions: Record<string, string[]>;
  updatedAt: string;
}

export function getDefaultPermissionsMatrix(): StoredPermissionsMatrix {
  return {
    resources: [...STANDARD_RESOURCES],
    actions: [...STANDARD_ACTIONS],
    roles: [...ROOT_DEFAULT_ROLES],
    rolePermissions: { ...INITIAL_ROLE_PERMISSIONS },
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchRootPermissionsMatrix(): Promise<StoredPermissionsMatrix> {
  try {
    const s3 = getR2Client();
    const bucket = getR2BucketName();
    const res = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: ROOT_PERMISSIONS_STORAGE_KEY,
      })
    );
    const text = await res.Body?.transformToString();
    if (!text) return getDefaultPermissionsMatrix();
    const parsed = JSON.parse(text) as StoredPermissionsMatrix;
    return {
      resources: parsed.resources?.length ? parsed.resources : STANDARD_RESOURCES,
      actions: parsed.actions?.length ? parsed.actions : STANDARD_ACTIONS,
      roles: parsed.roles?.length ? parsed.roles : ROOT_DEFAULT_ROLES,
      rolePermissions: parsed.rolePermissions || INITIAL_ROLE_PERMISSIONS,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return getDefaultPermissionsMatrix();
  }
}

export async function saveRootPermissionsMatrix(
  data: Partial<StoredPermissionsMatrix>
): Promise<StoredPermissionsMatrix | null> {
  try {
    const current = await fetchRootPermissionsMatrix();
    const updated: StoredPermissionsMatrix = {
      resources: data.resources || current.resources,
      actions: data.actions || current.actions,
      roles: data.roles || current.roles,
      rolePermissions: data.rolePermissions || current.rolePermissions,
      updatedAt: new Date().toISOString(),
    };

    const s3 = getR2Client();
    const bucket = getR2BucketName();
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: ROOT_PERMISSIONS_STORAGE_KEY,
        Body: Buffer.from(JSON.stringify(updated, null, 2)),
        ContentType: "application/json",
      })
    );
    return updated;
  } catch (err) {
    console.error("Failed to save root permissions matrix to R2:", err);
    return null;
  }
}
