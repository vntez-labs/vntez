/**
 * High-performance Typed API Client for VNTEZ Ecosystem.
 * Wraps browser-native Fetch API with auto-JSON parsing, error extraction,
 * timeout safety, and seamless toast feedback.
 */

import { toast } from "sonner";

export interface ApiRequestOptions extends RequestInit {
  timeoutMs?: number;
  silent?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request<T = unknown>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    timeoutMs = 15000,
    silent = false,
    headers: customHeaders = {},
    ...rest
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const isFormData = typeof FormData !== "undefined" && rest.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(customHeaders as Record<string, string>),
  };

  try {
    const res = await fetch(url, {
      ...rest,
      headers,
      signal: rest.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    // 1. Handle HTTP 401 Unauthorized
    if (res.status === 401 && typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/login")) {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    // 2. Parse response body safely
    let data: unknown = null;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await res.json().catch(() => null);
    } else {
      data = await res.text().catch(() => null);
    }

    // 3. Handle non-2xx responses
    if (!res.ok) {
      let errorMessage = `Yêu cầu thất bại (${res.status})`;
      if (data && typeof data === "object") {
        const errorRecord = data as Record<string, unknown>;
        if (typeof errorRecord.error === "string") {
          errorMessage = errorRecord.error;
        } else if (typeof errorRecord.message === "string") {
          errorMessage = errorRecord.message;
        }
      }

      if (!silent && typeof window !== "undefined") {
        toast.error(errorMessage);
      }

      throw new ApiError(errorMessage, res.status, data);
    }

    return data as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    const isAbort = (err as { name?: string })?.name === "AbortError";
    const msg = isAbort
      ? "Yêu cầu mạng bị quá thời gian chờ (15s)"
      : err instanceof Error
        ? err.message
        : "Lỗi kết nối mạng";

    if (!silent && typeof window !== "undefined") {
      toast.error(msg);
    }

    throw new ApiError(msg, isAbort ? 408 : 0, null);
  }
}

export const api = {
  get<T = unknown>(url: string, options?: ApiRequestOptions): Promise<T> {
    return request<T>(url, { ...options, method: "GET" });
  },

  post<T = unknown>(url: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return request<T>(url, {
      ...options,
      method: "POST",
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  put<T = unknown>(url: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return request<T>(url, {
      ...options,
      method: "PUT",
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  patch<T = unknown>(url: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return request<T>(url, {
      ...options,
      method: "PATCH",
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  delete<T = unknown>(url: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    let requestBody = body;
    let requestOptions = options;

    if (
      body &&
      typeof body === "object" &&
      options === undefined &&
      ("timeoutMs" in body || "silent" in body || "signal" in body)
    ) {
      requestOptions = body as ApiRequestOptions;
      requestBody = undefined;
    }

    const isFormData = typeof FormData !== "undefined" && requestBody instanceof FormData;
    return request<T>(url, {
      ...requestOptions,
      method: "DELETE",
      body: isFormData
        ? (requestBody as FormData)
        : requestBody !== undefined
          ? JSON.stringify(requestBody)
          : undefined,
    });
  },

  upload<T = unknown>(url: string, formData: FormData, options?: ApiRequestOptions): Promise<T> {
    return request<T>(url, {
      ...options,
      method: "POST",
      body: formData,
    });
  },
};
