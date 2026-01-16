import { ok, err, type Result } from "@/shared/lib/result";
import { getAuthHeaders, getAccessToken } from "./server-auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

export async function serverFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint.slice(1)
    : endpoint;

  const url = `${API_BASE_URL}/${normalizedEndpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Lỗi ${res.status}`;
    try {
      const errorBody = await res.json();
      message = errorBody.error || errorBody.message || message;
    } catch {
      // JSON parse failed, use default message
    }
    console.error(`[serverFetch] ${res.status} - ${message} - ${url}`);
    throw new Error(message);
  }

  return res.json();
}

export async function withAuthFetch<T>(
  fetcher: (headers: HeadersInit) => Promise<T>,
  errorMessage: string,
): Promise<Result<T>> {
  try {
    // Check if user is authenticated before making the request
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return err("Chưa đăng nhập");
    }

    const headers = await getAuthHeaders();
    const data = await fetcher(headers);
    return ok(data);
  } catch (error) {
    return err(error instanceof Error ? error.message : errorMessage);
  }
}
