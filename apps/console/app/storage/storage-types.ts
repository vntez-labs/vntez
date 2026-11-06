export interface R2FileItem {
  key: string;
  size: number;
  uploaded_at: string;
  content_type: string;
  etag?: string;
  download_url?: string;
}

export interface StorageMetrics {
  total_bytes: number;
  total_files: number;
  storage_limit_bytes: number; // e.g. 10 GB Cloudflare R2 Free Tier = 10 * 1024 * 1024 * 1024
  bandwidth_egress_bytes: number;
  monthly_operations: {
    class_a: number; // Put, Copy, List
    class_b: number; // Get, Head
  };
}
