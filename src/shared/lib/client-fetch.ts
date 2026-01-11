"use client";

/**
 * Client-side fetch wrapper with automatic token refresh
 * Handles 401 errors by refreshing token and retrying the request
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Parse JWT payload to check expiry (client-side safe)
 */
function parseJwtExpiry(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    // Use atob for client-side base64 decoding
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(decoded);
    return typeof data.exp === "number" ? data.exp : null;
  } catch {
    return null;
  }
}

/**
 * Check if token needs refresh (expiring within bufferSeconds)
 */
function tokenNeedsRefresh(token: string, bufferSeconds = 120): boolean {
  const exp = parseJwtExpiry(token);
  if (!exp) return true;

  const nowSeconds = Math.floor(Date.now() / 1000);
  return exp - bufferSeconds <= nowSeconds;
}

/**
 * Get access token from cookie
 */
function getAccessTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Refresh tokens via API - exported for use in other client-side files
 */
export async function refreshTokens(): Promise<boolean> {
  // Dedupe concurrent refresh calls
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = doRefresh();

  try {
    return await refreshPromise;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

async function doRefresh(): Promise<boolean> {
  try {
    console.log("[ClientFetch] Refreshing tokens...");

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      console.log("[ClientFetch] Token refresh successful");
      return true;
    }

    console.warn("[ClientFetch] Token refresh failed:", res.status);

    // If refresh fails, redirect to login
    if (res.status === 401 || res.status === 403) {
      window.location.href = `/auth/login?next=${encodeURIComponent(
        window.location.pathname
      )}`;
    }

    return false;
  } catch (error) {
    console.error("[ClientFetch] Refresh error:", error);
    return false;
  }
}

/**
 * Client-side fetch with automatic token refresh
 * - Proactively refreshes if token is expiring soon
 * - Retries on 401 after refreshing token
 */
export async function clientFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint.slice(1)
    : endpoint;
  const url = `${API_BASE_URL}/${normalizedEndpoint}`;

  // Proactive refresh: check if token is expiring soon
  const token = getAccessTokenFromCookie();
  if (token && tokenNeedsRefresh(token, 120)) {
    console.log("[ClientFetch] Token expiring soon, proactively refreshing...");
    await refreshTokens();
  }

  // First attempt
  let res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  // If 401, try to refresh and retry once
  if (res.status === 401) {
    console.log("[ClientFetch] Got 401, attempting token refresh...");
    const refreshed = await refreshTokens();

    if (refreshed) {
      // Retry the request
      res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });
    }
  }

  if (!res.ok) {
    try {
      const errorBody = await res.json();
      const message =
        errorBody.message || errorBody.error || `API Error: ${res.status}`;
      throw new Error(message);
    } catch {
      throw new Error(`API Error: ${res.status}`);
    }
  }

  return res.json();
}

/**
 * Setup proactive token refresh interval
 * Call this once in your app layout or root component
 */
export function setupTokenRefreshInterval(
  intervalMs = 5 * 60 * 1000
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const checkAndRefresh = async () => {
    const token = getAccessTokenFromCookie();
    if (token && tokenNeedsRefresh(token, 180)) {
      console.log("[TokenRefresh] Proactive refresh triggered by interval");
      await refreshTokens();
    }
  };

  // Check immediately on setup
  checkAndRefresh();

  // Setup interval
  const intervalId = setInterval(checkAndRefresh, intervalMs);

  // Return cleanup function
  return () => clearInterval(intervalId);
}
