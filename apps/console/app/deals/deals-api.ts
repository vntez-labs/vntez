import type { ClientRequestRecord } from "@/lib/client-requests";
import type { DealFormData } from "./deals-types";

export async function fetchDealsApi(): Promise<ClientRequestRecord[]> {
  const res = await fetch("/api/client-requests");
  if (!res.ok) throw new Error("Không thể tải danh sách Deal");
  const data = await res.json();
  return data.requests || [];
}

export async function createDealApi(formData: DealFormData): Promise<void> {
  const uris = formData.requested_redirect_uris
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  const res = await fetch("/api/client-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project_name: formData.project_name.trim(),
      project_website: formData.project_website.trim() || null,
      requested_redirect_uris: uris,
      auto_approve: formData.auto_approve,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Không thể tạo ứng dụng");
  }
}

export async function updateDealApi(
  id: string,
  formData: DealFormData
): Promise<void> {
  const uris = formData.requested_redirect_uris
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  const res = await fetch("/api/client-requests", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      project_name: formData.project_name,
      deal_type: formData.deal_type,
      applicant_name: formData.applicant_name,
      applicant_email: formData.applicant_email,
      applicant_phone: formData.applicant_phone || null,
      identity_proof: formData.identity_proof || null,
      project_idea: formData.project_idea,
      project_website: formData.project_website || null,
      requested_redirect_uris: uris,
      admin_notes: formData.admin_notes || null,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Không thể cập nhật hồ sơ");
  }
}

export async function deleteDealApi(id: string): Promise<void> {
  const res = await fetch(
    `/api/client-requests?id=${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Không thể xóa hồ sơ Deal");
  }
}

export async function approveDealApi(id: string, notes?: string): Promise<void> {
  const res = await fetch("/api/client-requests/approve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      admin_notes: notes?.trim() || undefined,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Không thể phê duyệt Deal đối tác");
  }
}

export async function declineDealApi(id: string, reason: string): Promise<void> {
  const res = await fetch("/api/client-requests/decline", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      reason: reason.trim(),
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Không thể từ chối hồ sơ Deal");
  }
}
