import crypto from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type { ClientRequestRecord } from "./client-requests-types";

export * from "./client-requests-types";

// 1. Get all client requests from Supabase
export async function getAllClientRequests(): Promise<{
  records: ClientRequestRecord[];
  isUsingSupabase: boolean;
}> {
  try {
    const supabaseClient = getSupabaseAdminClient();
    let { data, error } = await supabaseClient
      .from("oauth_client_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      const fallback = await supabaseClient
        .from("app_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (!fallback.error && fallback.data && fallback.data.length > 0) {
        data = fallback.data;
        error = fallback.error;
      }
    }

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
  } catch (err) {
    console.error("Failed to query client requests from Supabase:", err);
  }

  return {
    records: [],
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
    requested_redirect_uris: input.requested_redirect_uris || [],
    deal_type: input.deal_type || "individual",
    status: "pending",
    admin_notes: null,
    approved_client_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabaseClient = getSupabaseAdminClient();
  const { data, error } = await supabaseClient
    .from("oauth_client_requests")
    .insert([newRecord])
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Không thể lưu yêu cầu client vào cơ sở dữ liệu");
  }

  return {
    ...data,
    requested_redirect_uris: Array.isArray(data.requested_redirect_uris)
      ? data.requested_redirect_uris
      : [],
  };
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

  const supabaseClient = getSupabaseAdminClient();
  const { data, error } = await supabaseClient
    .from("oauth_client_requests")
    .update(cleanUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

// 4. Delete client request
export async function deleteClientRequest(id: string): Promise<boolean> {
  const supabaseClient = getSupabaseAdminClient();
  const { error } = await supabaseClient
    .from("oauth_client_requests")
    .delete()
    .eq("id", id);

  return !error;
}

// 5. Approve Client Request -> Creates real client in Supabase oauth_clients!
export async function approveClientRequest(
  id: string,
  adminNotes?: string
): Promise<{ success: boolean; client_id: string; record: ClientRequestRecord }> {
  const { records } = await getAllClientRequests();
  const target = records.find((r) => r.id === id);

  if (!target) {
    throw new Error(`Không tìm thấy yêu cầu [${id}]`);
  }

  const generatedClientId = `vntez_${crypto.randomBytes(12).toString("hex")}`;
  const supabaseClient = getSupabaseAdminClient();

  // Create active OAuth client
  const { error: clientError } = await supabaseClient
    .from("oauth_clients")
    .insert([
      {
        client_id: generatedClientId,
        name: target.project_name,
        description: target.project_idea,
        redirect_uris: target.requested_redirect_uris,
        logo_url: null,
        is_internal: false,
        created_at: new Date().toISOString(),
      },
    ]);

  if (clientError) {
    console.error("Failed to insert into oauth_clients:", clientError);
  }

  // Update status in request table
  const updated = await updateClientRequest(id, {
    status: "approved",
    admin_notes: adminNotes || `Đã phê duyệt và cấp phát Client ID: ${generatedClientId}`,
    approved_client_id: generatedClientId,
  });

  return {
    success: true,
    client_id: generatedClientId,
    record: updated || {
      ...target,
      status: "approved",
      approved_client_id: generatedClientId,
    },
  };
}

// 6. Decline Client Request
export async function declineClientRequest(
  id: string,
  reason: string
): Promise<ClientRequestRecord> {
  const updated = await updateClientRequest(id, {
    status: "rejected",
    admin_notes: reason,
  });

  if (!updated) {
    throw new Error(`Không thể từ chối yêu cầu [${id}]`);
  }

  return updated;
}

// 7. Check user client access status
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
  const isSuperAdmin = userEmail === "hnamhocit@gmail.com" || userEmail.endsWith("@vntez.com") || userEmail.includes("admin");
  const { records } = await getAllClientRequests();
  const userRequests = records.filter(
    (r) => (r.user_id && r.user_id === userId) || r.applicant_email.toLowerCase() === userEmail.toLowerCase()
  );

  const approvedRequests = userRequests.filter((r) => r.status === "approved");
  const pendingRequests = userRequests.filter((r) => r.status === "pending");
  const rejectedRequests = userRequests.filter((r) => r.status === "rejected");

  let approvedClientIds: string[] = approvedRequests.map((r) => r.approved_client_id).filter(Boolean) as string[];

  try {
    const supabaseClient = getSupabaseAdminClient();
    const { data: clients } = await supabaseClient.from("apps").select("id");
    if (clients && clients.length > 0 && isSuperAdmin) {
      approvedClientIds = clients.map((c) => c.id);
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
