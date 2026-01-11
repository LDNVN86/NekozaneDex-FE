import { cookies } from "next/headers";
import type { AuthUser } from "../types/auth";
import { ok, err, type Result } from "@/response/response";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

class AuthClient {
  private static instance: AuthClient;

  private constructor() {}

  static getInstance(): AuthClient {
    if (!AuthClient.instance) {
      AuthClient.instance = new AuthClient();
    }
    return AuthClient.instance;
  }

  async getCookieHeader(): Promise<string> {
    const cookieStore = await cookies();
    return cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
  }

  async getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("access_token")?.value ?? null;
  }

  async getRefreshToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("refresh_token")?.value ?? null;
  }

  async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<Result<T, string>> {
    try {
      const cookieHeader = await this.getCookieHeader();
      const normalizedEndpoint = endpoint.replace(/^\//, "");

      const res = await fetch(`${API_BASE_URL}/${normalizedEndpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
          ...options?.headers,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Unknown error" }));
        // Return status code in error for upstream handling
        return err(`${res.status}: ${errorData.message || "API Error"}`);
      }

      const data = await res.json();
      return ok(data);
    } catch (error) {
      return err(error instanceof Error ? error.message : "Network error");
    }
  }

  async getCurrentUser(): Promise<Result<AuthUser, string>> {
    const token = await this.getAccessToken();
    const refreshToken = await this.getRefreshToken();

    // No tokens at all
    if (!token && !refreshToken) {
      return err("Not authenticated");
    }

    // If we have access_token, try to fetch profile
    if (token) {
      const result = await this.fetch<{ data: AuthUser }>("/auth/profile");

      if (result.success) {
        return ok(result.data.data);
      }

      // If 401, the token is expired
      if (result.error.startsWith("401")) {
        console.log("[Auth] Access token expired, need refresh");
        // Can't refresh here (no cookie write in Server Component)
        // Just return error - proxy should have handled this
        return err("Session expired");
      }

      return err(result.error);
    }

    // No access_token but have refresh_token
    // Proxy should have refreshed, but maybe it didn't run for this path
    return err("No access token - refresh needed");
  }
}

export const authClient = AuthClient.getInstance();

// ===== Exported Functions =====
export const getAuthFromCookie = (): Promise<Result<AuthUser, string>> =>
  authClient.getCurrentUser();

export const authServerFetch = <T>(
  endpoint: string,
  options?: RequestInit
): Promise<Result<T, string>> => authClient.fetch<T>(endpoint, options);

// ===== Utility Functions =====
export const hasRole = (user: AuthUser | null, roles: string[]): boolean =>
  user !== null && roles.includes(user.role);

export const isAuthenticated = (user: AuthUser | null): boolean =>
  user !== null;
