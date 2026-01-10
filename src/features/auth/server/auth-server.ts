import { cookies } from "next/headers";
import type { AuthUser } from "../types/auth";
import { ok, err, type Result } from "@/types/type";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

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
        return err(errorData.message || `API Error: ${res.status}`);
      }

      const data = await res.json();
      return ok(data);
    } catch (error) {
      return err(error instanceof Error ? error.message : "Network error");
    }
  }

  async getCurrentUser(): Promise<Result<AuthUser, string>> {
    const token = await this.getAccessToken();

    if (!token) {
      return err("No access token found");
    }

    const result = await this.fetch<{ data: AuthUser }>("/auth/profile");

    if (!result.success) {
      return err(result.error);
    }

    return ok(result.data.data);
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
