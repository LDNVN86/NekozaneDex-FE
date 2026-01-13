import "server-only";
import { cookies, headers } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

export async function getAccessToken(): Promise<string | null> {
  const headersList = await headers();
  const refreshedToken = headersList.get("x-refreshed-access-token");
  if (refreshedToken) {
    return refreshedToken;
  }

  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value ?? null;
}

export async function getCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("csrf_token")?.value ?? null;
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  return !!token;
}

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
