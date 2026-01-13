import "server-only";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

interface RefreshResponse {
  data: {
    access_token: string;
  };
}

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      console.error("[Token Refresh] No refresh token available");
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${refreshToken}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`[Token Refresh] Failed with status ${response.status}`);
      return null;
    }

    const data = (await response.json()) as RefreshResponse;
    const newAccessToken = data.data?.access_token;

    if (!newAccessToken) {
      console.error("[Token Refresh] No access token in response");
      return null;
    }

    console.log("[Token Refresh] Successfully refreshed access token");
    return newAccessToken;
  } catch (error) {
    console.error("[Token Refresh] Error:", error);
    return null;
  }
}

export async function getValidAccessToken(
  currentToken: string | undefined,
  bufferSeconds = 60
): Promise<string | null> {
  if (!currentToken) {
    return await refreshAccessToken();
  }

  const { isTokenValid } = await import("./token-utils");

  if (isTokenValid(currentToken, bufferSeconds)) {
    return currentToken;
  }

  console.log("[Token] Access token expiring soon, refreshing...");
  return await refreshAccessToken();
}
