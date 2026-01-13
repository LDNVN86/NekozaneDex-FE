import { NextResponse, NextRequest } from "next/server";

type RouteRule = {
  path: string;
  requireAuth: boolean;
  roles?: string[];
  redirectTo?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

const ROUTE_CONFIG: RouteRule[] = [
  { path: "/client/profile", requireAuth: true },
  { path: "/client/bookmarks", requireAuth: true },
  { path: "/client/history", requireAuth: true },
  { path: "/server/admin", requireAuth: true, roles: ["admin"] },
  { path: "/auth/login", requireAuth: false, redirectTo: "/" },
  { path: "/auth/register", requireAuth: false, redirectTo: "/" },
];

function findMatchingRule(pathname: string): RouteRule | undefined {
  return ROUTE_CONFIG.find((rule) => pathname.startsWith(rule.path));
}

function createRedirectUrl(path: string, request: NextRequest): URL {
  return new URL(path, request.url);
}

function isTokenValid(token: string, bufferSeconds = 3): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = parts[1];
    const decoded = Buffer.from(payload, "base64url").toString("utf-8");
    const data = JSON.parse(decoded);

    if (data.exp) {
      const expTime = data.exp * 1000;
      const now = Date.now();
      const bufferMs = bufferSeconds * 1000;
      return expTime - now > bufferMs;
    }

    return true;
  } catch (error) {
    console.error("[Proxy] JWT parse error:", error);
    return false;
  }
}

let refreshPromise: Promise<{
  accessToken: string;
  setCookieHeaders: string[];
} | null> | null = null;
let refreshPromiseExpiry = 0;

async function tryRefreshToken(
  request: NextRequest
): Promise<{ accessToken: string; setCookieHeaders: string[] } | null> {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    console.log("[Proxy] No refresh token available");
    return null;
  }

  const now = Date.now();
  if (refreshPromise && now < refreshPromiseExpiry) {
    console.log("[Proxy] Waiting for ongoing refresh...");
    return refreshPromise;
  }

  refreshPromiseExpiry = now + 5000;

  refreshPromise = doRefresh(refreshToken);

  try {
    return await refreshPromise;
  } finally {
    setTimeout(() => {
      if (Date.now() >= refreshPromiseExpiry) {
        refreshPromise = null;
      }
    }, 100);
  }
}

async function doRefresh(
  refreshToken: string
): Promise<{ accessToken: string; setCookieHeaders: string[] } | null> {
  try {
    console.log("[Proxy] Attempting server-side token refresh...");

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${refreshToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.log("[Proxy] Refresh failed:", response.status);
      return null;
    }

    const setCookieHeaders = response.headers.getSetCookie();
    const data = await response.json();

    console.log("[Proxy] Token refresh successful");

    return {
      accessToken: data.data?.access_token || data.access_token,
      setCookieHeaders,
    };
  } catch (error) {
    console.error("[Proxy] Refresh error:", error);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const rule = findMatchingRule(pathname);

  if (!rule) {
    console.log(`[Proxy] ${pathname} (public route)`);

    if ((!accessToken || !isTokenValid(accessToken)) && refreshToken) {
      console.log("[Proxy] Public route - refreshing expired token");
      const refreshResult = await tryRefreshToken(request);

      if (refreshResult) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set(
          "x-refreshed-access-token",
          refreshResult.accessToken
        );
        requestHeaders.set("x-pathname", pathname);

        const response = NextResponse.next({
          request: { headers: requestHeaders },
        });

        for (const cookie of refreshResult.setCookieHeaders) {
          response.headers.append("Set-Cookie", cookie);
        }

        return response;
      }
    }

    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }

  let hasValidToken = accessToken && isTokenValid(accessToken);

  if (!hasValidToken && refreshToken && rule.requireAuth) {
    const refreshResult = await tryRefreshToken(request);

    if (refreshResult) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-refreshed-access-token", refreshResult.accessToken);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      response.headers.set("x-pathname", pathname);

      for (const cookie of refreshResult.setCookieHeaders) {
        response.headers.append("Set-Cookie", cookie);
      }

      console.log(`[Proxy] ${pathname} (refreshed token, continuing)`);
      return response;
    }

    console.log(`[Proxy] ${pathname} refresh failed, redirecting to login`);
    const loginUrl = createRedirectUrl("/auth/login", request);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (rule.requireAuth && !hasValidToken) {
    console.log(`[Proxy] ${pathname} requires auth, redirecting to login`);
    const loginUrl = createRedirectUrl("/auth/login", request);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!rule.requireAuth && rule.redirectTo && hasValidToken) {
    console.log(`[Proxy] Already logged in, redirecting to ${rule.redirectTo}`);
    return NextResponse.redirect(createRedirectUrl(rule.redirectTo, request));
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    "/",
    "/client/:path*",
    "/server/admin/:path*",
    "/auth/login/:path*",
    "/auth/register/:path*",
  ],
};
