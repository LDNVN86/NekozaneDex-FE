import "server-only";
import { cookies, headers } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

// ============================================================================
// Core Auth Utilities
// ============================================================================

/**
 * Get the current access token
 * Checks proxy header first (for refreshed tokens), then falls back to cookie
 *
 * This is the SINGLE SOURCE OF TRUTH for getting the access token
 * All server-side code should use this instead of directly reading cookies
 */
export async function getAccessToken(): Promise<string | null> {
  // First check if proxy has passed a refreshed token via header
  const headersList = await headers();
  const refreshedToken = headersList.get("x-refreshed-access-token");
  if (refreshedToken) {
    return refreshedToken;
  }

  // Fallback to cookie
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

/**
 * Get refresh token from cookie
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value ?? null;
}

/**
 * Get CSRF token from cookie
 */
export async function getCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("csrf_token")?.value ?? null;
}

/**
 * Check if user is authenticated (has valid access token)
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  return !!token;
}

// ============================================================================
// Auth Headers
// ============================================================================

/**
 * Build authorization headers for API requests
 * Automatically uses the refreshed token if available
 * Returns HeadersInit for compatibility with fetch API
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
  const accessToken = await getAccessToken();
  const csrfToken = await getCsrfToken();

  const headers: Record<string, string> = {};

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
    headers["Cookie"] = `csrf_token=${csrfToken}; access_token=${
      accessToken || ""
    }`;
  }

  return headers;
}

// ============================================================================
// Auth Fetch Wrapper
// ============================================================================

export interface FetchResult<T> {
  success: true;
  data: T;
}

export interface FetchError {
  success: false;
  error: string;
  status?: number;
}

export type AuthFetchResult<T> = FetchResult<T> | FetchError;

/**
 * Authenticated fetch wrapper for server-side API calls
 * Automatically includes auth headers with refreshed token support
 *
 * Usage:
 * ```ts
 * const result = await authFetch<User>("/auth/profile");
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export async function authFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<AuthFetchResult<T>> {
  const token = await getAccessToken();

  if (!token) {
    return { success: false, error: "Chưa đăng nhập", status: 401 };
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint.slice(1)
    : endpoint;

  try {
    const res = await fetch(`${API_BASE_URL}/${normalizedEndpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ message: "API Error" }));
      return {
        success: false,
        error: errorData.message || errorData.error || `Error: ${res.status}`,
        status: res.status,
      };
    }

    const data = await res.json();
    return { success: true, data: data.data ?? data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Authenticated fetch for FormData (file uploads)
 * Does NOT set Content-Type header (let browser set it for multipart)
 */
export async function authFetchFormData<T>(
  endpoint: string,
  formData: FormData,
  method: "POST" | "PUT" | "PATCH" = "POST"
): Promise<AuthFetchResult<T>> {
  const token = await getAccessToken();

  if (!token) {
    return { success: false, error: "Chưa đăng nhập", status: 401 };
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint.slice(1)
    : endpoint;

  try {
    const res = await fetch(`${API_BASE_URL}/${normalizedEndpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ message: "API Error" }));
      return {
        success: false,
        error: errorData.message || errorData.error || `Error: ${res.status}`,
        status: res.status,
      };
    }

    const data = await res.json();
    return { success: true, data: data.data ?? data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}
