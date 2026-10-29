import { create } from "zustand";

export type Provider = "github" | "google" | "facebook";

interface AuthState {
  isLoading: Provider | null;
  error: string | null;
  providerErrors: Record<Provider, string | null>;

  // Actions
  startLoading: (provider: Provider) => void;
  stopLoading: () => void;
  setError: (message: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: null,
  error: null,
  providerErrors: {
    github: null,
    google: null,
    facebook: null,
  },

  startLoading: (provider) =>
    set({
      isLoading: provider,
      error: null,
      providerErrors: { ...get().providerErrors, [provider]: null }, // Reset lỗi cũ của provider này
    }),

  stopLoading: () => set({ isLoading: null }),

  setError: (message) => {
    // Chặn hoàn toàn thông điệp NEXT_REDIRECT hiển thị lên giao diện
    if (!message || message.includes("NEXT_REDIRECT")) {
      return;
    }
    set({ error: message });
  },

  clearError: () => set({ error: null }),
}));

// Helper getter bên trong actions nếu cần access state trực tiếp (không dùng hook)
const get = useAuthStore.getState;
