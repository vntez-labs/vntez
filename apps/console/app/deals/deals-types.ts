import type { ClientRequestRecord } from "@/lib/client-requests";

export interface DealFormData {
  project_name: string;
  deal_type: "partner" | "enterprise" | "startup" | "individual";
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  identity_proof: string;
  project_idea: string;
  project_website: string;
  requested_redirect_uris: string;
  admin_notes: string;
  auto_approve: boolean;
}

export const initialFormData: DealFormData = {
  project_name: "",
  deal_type: "enterprise",
  applicant_name: "",
  applicant_email: "",
  applicant_phone: "",
  identity_proof: "",
  project_idea: "",
  project_website: "",
  requested_redirect_uris: "http://localhost:3000/auth/callback",
  admin_notes: "",
  auto_approve: true,
};

export interface DealsState {
  requests: ClientRequestRecord[];
  isLoading: boolean;
  searchQuery: string;
  statusFilter: "all" | "pending" | "approved" | "rejected";
  dealTypeFilter: string;
  copiedId: string | null;

  // Modals state
  viewingRequest: ClientRequestRecord | null;
  approvingRequest: ClientRequestRecord | null;
  decliningRequest: ClientRequestRecord | null;
  editingRequest: ClientRequestRecord | null;
  deletingRequest: ClientRequestRecord | null;
  isCreateOpen: boolean;

  // Form states
  isSubmitting: boolean;
  formError: string | null;
  adminNotesInput: string;
  declineReasonInput: string;
  formData: DealFormData;

  // Actions
  fetchRequests: () => Promise<void>;
  handleCopy: (text: string, id: string) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: "all" | "pending" | "approved" | "rejected") => void;
  setDealTypeFilter: (filter: string) => void;

  setViewingRequest: (req: ClientRequestRecord | null) => void;
  setApprovingRequest: (req: ClientRequestRecord | null) => void;
  setDecliningRequest: (req: ClientRequestRecord | null) => void;
  setDeletingRequest: (req: ClientRequestRecord | null) => void;
  setAdminNotesInput: (notes: string) => void;
  setDeclineReasonInput: (reason: string) => void;

  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (req: ClientRequestRecord) => void;
  closeEditModal: () => void;
  updateFormData: (data: Partial<DealFormData>) => void;

  handleCreateSubmit: (e: React.FormEvent) => Promise<void>;
  handleEditSubmit: (e: React.FormEvent) => Promise<void>;
  handleDeleteConfirm: () => Promise<void>;
  handleApproveConfirm: () => Promise<void>;
  handleDeclineConfirm: () => Promise<void>;
}
