import { create } from "zustand";
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
        const res = await fetch("/api/storage");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.files)) {
            set({
              files: data.files,
              metrics: data.metrics || calcMetrics(data.files),
            });
          }
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

        const res = await fetch("/api/storage", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload thất bại");
        }

        set({ uploadProgress: 100 });

        const updatedFiles = [data.file, ...get().files];
        set({
          files: updatedFiles,
          metrics: calcMetrics(updatedFiles),
          isUploading: false,
          uploadProgress: 0,
        });

        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload thất bại";
        set({ isUploading: false, uploadProgress: 0, uploadError: message });
        return false;
      }
    },

    deleteFile: async (key: string) => {
      try {
        const res = await fetch(`/api/storage?key=${encodeURIComponent(key)}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Xóa thất bại");
        }

        const remainingFiles = get().files.filter((f) => f.key !== key);
        set({ files: remainingFiles, metrics: calcMetrics(remainingFiles) });
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Xóa file thất bại");
      }
    },

    getDownloadUrl: async (key: string) => {
      set({ generatingKey: key, generatedSignedUrl: null });
      const target = get().files.find((f) => f.key === key);
      const url = target?.download_url || `https://stbswcnsitztbusqrdhi.supabase.co/storage/v1/object/public/vntez-assets/${key}`;
      set({ generatedSignedUrl: url, generatingKey: null });
      return url;
    },

    clearGeneratedUrl: () => set({ generatedSignedUrl: null, generatingKey: null }),
  };
});
