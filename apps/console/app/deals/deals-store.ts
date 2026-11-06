import { create } from "zustand";
import type { ClientRequestRecord } from "@/lib/client-requests";
import {
  type DealFormData,
  type DealsState,
  initialFormData,
} from "./deals-types";
import {
  fetchDealsApi,
  createDealApi,
  updateDealApi,
  deleteDealApi,
  approveDealApi,
  declineDealApi,
} from "./deals-api";

export * from "./deals-types";

export const useDealsStore = create<DealsState>((set, get) => ({
  requests: [],
  isLoading: true,
  searchQuery: "",
  statusFilter: "all",
  dealTypeFilter: "all",
  copiedId: null,

  viewingRequest: null,
  approvingRequest: null,
  decliningRequest: null,
  editingRequest: null,
  deletingRequest: null,
  isCreateOpen: false,

  isSubmitting: false,
  formError: null,
  adminNotesInput: "",
  declineReasonInput: "",
  formData: initialFormData,

  fetchRequests: async () => {
    set({ isLoading: true });
    try {
      const requests = await fetchDealsApi();
      set({ requests });
    } catch (err) {
      console.error("Failed to fetch client requests:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  handleCopy: (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    set({ copiedId: id });
    setTimeout(() => set({ copiedId: null }), 2000);
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setDealTypeFilter: (dealTypeFilter) => set({ dealTypeFilter }),

  setViewingRequest: (viewingRequest) => set({ viewingRequest }),
  setApprovingRequest: (approvingRequest) => set({ approvingRequest, adminNotesInput: "" }),
  setDecliningRequest: (decliningRequest) => set({ decliningRequest, declineReasonInput: "" }),
  setDeletingRequest: (deletingRequest) => set({ deletingRequest }),
  setAdminNotesInput: (adminNotesInput) => set({ adminNotesInput }),
  setDeclineReasonInput: (declineReasonInput) => set({ declineReasonInput }),

  openCreateModal: () => {
    set({
      formData: { ...initialFormData },
      formError: null,
      isCreateOpen: true,
    });
  },

  closeCreateModal: () => set({ isCreateOpen: false, formError: null }),

  openEditModal: (req: ClientRequestRecord) => {
    set({
      editingRequest: req,
      formData: {
        project_name: req.project_name,
        deal_type: req.deal_type,
        applicant_name: req.applicant_name,
        applicant_email: req.applicant_email,
        applicant_phone: req.applicant_phone || "",
        identity_proof: req.identity_proof || "",
        project_idea: req.project_idea,
        project_website: req.project_website || "",
        requested_redirect_uris: req.requested_redirect_uris.join("\n"),
        admin_notes: req.admin_notes || "",
        auto_approve: false,
      },
      formError: null,
    });
  },

  closeEditModal: () => set({ editingRequest: null, formError: null }),

  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  handleCreateSubmit: async (e: React.FormEvent) => {
    e.preventDefault();
    const { formData, fetchRequests } = get();
    set({ formError: null, isSubmitting: true });

    try {
      await createDealApi(formData);
      set({ isCreateOpen: false });
      await fetchRequests();
    } catch (err) {
      set({ formError: err instanceof Error ? err.message : String(err) });
    } finally {
      set({ isSubmitting: false });
    }
  },

  handleEditSubmit: async (e: React.FormEvent) => {
    e.preventDefault();
    const { editingRequest, formData, fetchRequests } = get();
    if (!editingRequest) return;
    set({ formError: null, isSubmitting: true });

    try {
      await updateDealApi(editingRequest.id, formData);
      set({ editingRequest: null });
      await fetchRequests();
    } catch (err) {
      set({ formError: err instanceof Error ? err.message : String(err) });
    } finally {
      set({ isSubmitting: false });
    }
  },

  handleDeleteConfirm: async () => {
    const { deletingRequest, fetchRequests } = get();
    if (!deletingRequest) return;
    set({ isSubmitting: true });

    try {
      await deleteDealApi(deletingRequest.id);
      set({ deletingRequest: null });
      await fetchRequests();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      set({ isSubmitting: false });
    }
  },

  handleApproveConfirm: async () => {
    const { approvingRequest, adminNotesInput, fetchRequests } = get();
    if (!approvingRequest) return;
    set({ isSubmitting: true });

    try {
      await approveDealApi(approvingRequest.id, adminNotesInput);
      set({ approvingRequest: null, adminNotesInput: "" });
      await fetchRequests();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      set({ isSubmitting: false });
    }
  },

  handleDeclineConfirm: async () => {
    const { decliningRequest, declineReasonInput, fetchRequests } = get();
    if (!decliningRequest) return;
    if (!declineReasonInput.trim()) {
      alert("Vui lòng nhập lý do từ chối để đối tác có thông tin hoàn thiện hồ sơ.");
      return;
    }
    set({ isSubmitting: true });

    try {
      await declineDealApi(decliningRequest.id, declineReasonInput);
      set({ decliningRequest: null, declineReasonInput: "" });
      await fetchRequests();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
