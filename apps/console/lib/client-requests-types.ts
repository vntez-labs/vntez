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
