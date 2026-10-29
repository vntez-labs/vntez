import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase";

export interface ClientRequestRecord {
  id: string;
  user_id: string | null;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string | null;
  identity_proof: string | null;
  project_name: string;
  project_idea: string;
  project_website: string | null;
  requested_redirect_uris: string[];
  deal_type: "partner" | "enterprise" | "startup" | "individual";
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  approved_client_id: string | null;
  created_at: string;
  updated_at: string;
}

const LOCAL_STORE_PATH = path.join(process.cwd(), "data", "oauth_client_requests.json");

function ensureLocalStore(): ClientRequestRecord[] {
  try {
    const dir = path.dirname(LOCAL_STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_STORE_PATH)) {
      const initialSeed: ClientRequestRecord[] = [];
      fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(initialSeed, null, 2), "utf-8");
      return initialSeed;
    }
    const raw = fs.readFileSync(LOCAL_STORE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Local store read error:", err);
    return [];
  }
}

function writeLocalStore(records: ClientRequestRecord[]): void {
  try {
    const dir = path.dirname(LOCAL_STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(records, null, 2), "utf-8");
  } catch (err) {
    console.error("Local store write error:", err);
  }
}

// 1. Get all client requests (queries Supabase first, falls back to local store)
export async function getAllClientRequests(): Promise<{
  records: ClientRequestRecord[];
  isUsingSupabase: boolean;
}> {
  try {
    const supabaseClient = getSupabaseAdminClient();
    const { data, error } = await supabaseClient
      .from("oauth_client_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      return {
        records: data.map((r) => ({
          ...r,
          requested_redirect_uris: Array.isArray(r.requested_redirect_uris)
            ? r.requested_redirect_uris
            : [],
        })),
        isUsingSupabase: true,
      };
    }
  } catch {
    // Table not found in Supabase schema yet
  }

  const local = ensureLocalStore();
  return {
    records: local.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
    isUsingSupabase: false,
  };
}

// 2. Create new client request
export async function createClientRequest(
  input: Omit<ClientRequestRecord, "id" | "status" | "admin_notes" | "approved_client_id" | "created_at" | "updated_at">
): Promise<ClientRequestRecord> {
  const newRecord: ClientRequestRecord = {
    id: crypto.randomUUID(),
    user_id: input.user_id || null,
    applicant_name: input.applicant_name.trim(),
    applicant_email: input.applicant_email.trim().toLowerCase(),
    applicant_phone: input.applicant_phone?.trim() || null,
    identity_proof: input.identity_proof?.trim() || null,
    project_name: input.project_name.trim(),
    project_idea: input.project_idea.trim(),
    project_website: input.project_website?.trim() || null,
    requested_redirect_uris: input.requested_redirect_uris.filter(Boolean),
    deal_type: input.deal_type || "partner",
    status: "pending",
    admin_notes: null,
    approved_client_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const supabaseClient = getSupabaseAdminClient();
    const { data, error } = await supabaseClient
      .from("oauth_client_requests")
      .insert([newRecord])
      .select()
      .single();

    if (!error && data) {
      return {
        ...data,
        requested_redirect_uris: Array.isArray(data.requested_redirect_uris)
          ? data.requested_redirect_uris
          : [],
      };
    }
  } catch {
    // Supabase table not ready
  }

  const local = ensureLocalStore();
  local.unshift(newRecord);
  writeLocalStore(local);
  return newRecord;
}

// 3. Update client request
export async function updateClientRequest(
  id: string,
  updates: Partial<ClientRequestRecord>
): Promise<ClientRequestRecord | null> {
  const cleanUpdates = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  try {
    const supabaseClient = getSupabaseAdminClient();
    const { data, error } = await supabaseClient
      .from("oauth_client_requests")
      .update(cleanUpdates)
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      return data;
    }
  } catch {
    // Fallback local
  }

  const local = ensureLocalStore();
  const idx = local.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  const current = local[idx]!;
  const merged: ClientRequestRecord = {
    ...current,
    ...cleanUpdates,
    id: current.id,
    created_at: current.created_at,
    updated_at: new Date().toISOString(),
  };
  local[idx] = merged;
  writeLocalStore(local);
  return merged;
}

// 4. Delete client request
export async function deleteClientRequest(id: string): Promise<boolean> {
  try {
    const supabaseClient = getSupabaseAdminClient();
    const { error } = await supabaseClient
      .from("oauth_client_requests")
      .delete()
      .eq("id", id);

    if (!error) {
      return true;
    }
  } catch {
    // Fallback local
  }

  const local = ensureLocalStore();
  const filtered = local.filter((r) => r.id !== id);
  writeLocalStore(filtered);
  return true;
}

// 5. Approve Client Request -> Creates real client in Supabase oauth_clients!
export async function approveClientRequest(
  id: string,
  adminNotes?: string
): Promise<{ success: boolean; client_id: string; record: ClientRequestRecord }> {
  const { records } = await getAllClientRequests();
  const target = records.find((r) => r.id === id);

  if (!target) {
    throw new Error(`Không tìm thấy yêu cầu xét duyệt "${id}"`);
  }

  // Auto-generate secure client_id
  const clientId = `vntez_${crypto.randomBytes(12).toString("hex")}`;

  // 1. Insert real client into Supabase public.oauth_clients
  const supabaseClient = getSupabaseAdminClient();
  const { error: insertError } = await supabaseClient.from("oauth_clients").insert([
    {
      client_id: clientId,
      name: target.project_name,
      description: target.project_idea,
      redirect_uris: target.requested_redirect_uris,
      logo_url: null,
      is_internal: target.deal_type === "enterprise",
      created_at: new Date().toISOString(),
    },
  ]);

  if (insertError) {
    throw new Error(`Lỗi tạo OAuth Client trong Supabase: ${insertError.message}`);
  }

  // 2. Update request status to 'approved'
  const updated = await updateClientRequest(id, {
    status: "approved",
    approved_client_id: clientId,
    admin_notes: adminNotes || "Hồ sơ đối tác đạt chuẩn. Đã phê duyệt và cấp phát Client ID.",
  });

  return {
    success: true,
    client_id: clientId,
    record: updated || target,
  };
}

// 6. Decline Client Request (Reject deal)
export async function declineClientRequest(
  id: string,
  reason: string
): Promise<ClientRequestRecord> {
  const updated = await updateClientRequest(id, {
    status: "rejected",
    admin_notes: reason || "Chưa đạt tiêu chuẩn thẩm định đối tác.",
  });

  if (!updated) {
    throw new Error(`Không tìm thấy yêu cầu "${id}"`);
  }

  return updated;
}

// 7. Check if user has an approved client or is Super Admin
export async function checkUserClientStatus(
  userId: string,
  userEmail: string
): Promise<{
  isSuperAdmin: boolean;
  hasAccess: boolean;
  approvedClientsCount: number;
  approvedClientIds: string[];
  pendingRequests: ClientRequestRecord[];
  rejectedRequests: ClientRequestRecord[];
  approvedRequests: ClientRequestRecord[];
}> {
  // Super Admin bypass: always granted access
  const isSuperAdmin =
    userEmail === "hnamhocit@gmail.com" ||
    userEmail.endsWith("@vntez.com") ||
    userEmail.includes("admin");

  const { records } = await getAllClientRequests();
  const userRequests = records.filter(
    (r) =>
      (r.user_id && r.user_id === userId) ||
      r.applicant_email.toLowerCase() === userEmail.toLowerCase()
  );

  const approvedRequests = userRequests.filter((r) => r.status === "approved");
  const pendingRequests = userRequests.filter((r) => r.status === "pending");
  const rejectedRequests = userRequests.filter((r) => r.status === "rejected");

  // Query Supabase oauth_clients to see if any client matches
  let approvedClientIds: string[] = approvedRequests
    .map((r) => r.approved_client_id)
    .filter(Boolean) as string[];

  // Also query real clients from Supabase
  try {
    const supabaseClient = getSupabaseAdminClient();
    const { data: clients } = await supabaseClient
      .from("oauth_clients")
      .select("client_id");
    if (clients && clients.length > 0) {
      if (isSuperAdmin) {
        approvedClientIds = clients.map((c) => c.client_id);
      }
    }
  } catch {
    // Ignore
  }

  const hasApprovedClient = approvedRequests.length > 0 || (isSuperAdmin && approvedClientIds.length > 0);

  return {
    isSuperAdmin,
    hasAccess: isSuperAdmin || hasApprovedClient,
    approvedClientsCount: approvedClientIds.length,
    approvedClientIds,
    pendingRequests,
    rejectedRequests,
    approvedRequests,
  };
}
