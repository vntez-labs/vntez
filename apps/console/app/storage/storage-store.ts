import { create } from "zustand";
import { toast } from "@workspace/ui/components/toaster";
import { api } from "@workspace/ui/lib/api-client";
import type { R2FileItem, StorageMetrics } from "./storage-types";

const R2_FREE_LIMIT_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB Free Tier

interface StorageState {
  files: R2FileItem[];
  metrics: StorageMetrics;
  isLoading: boolean;
  searchQuery: string;
  filterType: string;

  // Upload status
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;

  // Signed URL generation
  generatedSignedUrl: string | null;
  generatingKey: string | null;

  // Actions
  fetchMetrics: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilterType: (filter: string) => void;
  uploadFile: (file: File, folder?: string) => Promise<boolean>;
  deleteFile: (key: string) => Promise<void>;
  getDownloadUrl: (key: string, expiresIn?: number) => Promise<string | null>;
  clearGeneratedUrl: () => void;
}

const defaultMetrics: StorageMetrics = {
  total_bytes: 0,
  total_files: 0,
  storage_limit_bytes: R2_FREE_LIMIT_BYTES,
  bandwidth_egress_bytes: 0,
  monthly_operations: {
    class_a: 0,
    class_b: 0,
  },
};

export const useStorageStore = create<StorageState>((set, get) => {
  const calcMetrics = (fileList: R2FileItem[]): StorageMetrics => {
    const totalBytes = fileList.reduce((acc, f) => acc + f.size, 0);
    return {
      total_bytes: totalBytes,
      total_files: fileList.length,
      storage_limit_bytes: R2_FREE_LIMIT_BYTES,
      bandwidth_egress_bytes: totalBytes * 2,
      monthly_operations: {
        class_a: 10 + fileList.length,
        class_b: 40 + fileList.length * 2,
      },
    };
  };

  return {
    files: [],
    metrics: defaultMetrics,
    isLoading: true,
    searchQuery: "",
    filterType: "all",

    isUploading: false,
    uploadProgress: 0,
    uploadError: null,

    generatedSignedUrl: null,
    generatingKey: null,

    fetchMetrics: async () => {
      set({ isLoading: true });
      try {
        const data = await api.get<{ success: boolean; files: R2FileItem[]; metrics?: StorageMetrics }>("/api/storage");
        if (data.success && Array.isArray(data.files)) {
          set({
            files: data.files,
            metrics: data.metrics || calcMetrics(data.files),
          });
        }
      } catch (err) {
        console.error("Failed to load live storage:", err);
      } finally {
        set({ isLoading: false });
      }
    },

    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setFilterType: (filterType) => set({ filterType }),

    uploadFile: async (file: File, folder = "uploads") => {
      set({ isUploading: true, uploadProgress: 20, uploadError: null });

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        set({ uploadProgress: 50 });

        const data = await api.upload<{ success: boolean; file: R2FileItem }>("/api/storage", formData);

        set({ uploadProgress: 100 });

        const updatedFiles = [data.file, ...get().files];
        set({
          files: updatedFiles,
          metrics: calcMetrics(updatedFiles),
          isUploading: false,
          uploadProgress: 0,
        });
        toast.success(`Đã tải lên "${data.file.key.split("/").pop() || data.file.key}" thành công`);

        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload thất bại";
        set({ isUploading: false, uploadProgress: 0, uploadError: message });
        return false;
      }
    },

    deleteFile: async (key: string) => {
      try {
        await api.delete(`/api/storage?key=${encodeURIComponent(key)}`);

        const remainingFiles = get().files.filter((f) => f.key !== key);
        set({ files: remainingFiles, metrics: calcMetrics(remainingFiles) });
        toast.success(`Đã xóa tệp tin "${key.split("/").pop()}" thành công`);
      } catch {
        // toast.error is already triggered inside api-client
      }
    },

    getDownloadUrl: async (key: string) => {
      set({ generatingKey: key, generatedSignedUrl: null });
      try {
        const data = await api.get<{ downloadUrl?: string }>(`/api/storage?key=${encodeURIComponent(key)}`);
        if (data.downloadUrl) {
          set({ generatedSignedUrl: data.downloadUrl, generatingKey: null });
          return data.downloadUrl;
        }
      } catch (err) {
        console.error("Failed to generate presigned URL:", err);
      }
      const target = get().files.find((f) => f.key === key);
      const fallbackUrl = target?.download_url || null;
      set({ generatedSignedUrl: fallbackUrl, generatingKey: null });
      return fallbackUrl;
    },

    clearGeneratedUrl: () => set({ generatedSignedUrl: null, generatingKey: null }),
  };
});
