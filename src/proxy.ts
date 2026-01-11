import { NextResponse, NextRequest } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

type RouteRule = {
  path: string;
  requireAuth: boolean;
  roles?: string[];
  redirectTo?: string;
};

const ROUTE_CONFIG: RouteRule[] = [
  { path: "/client/profile", requireAuth: true },
  { path: "/client/bookmarks", requireAuth: true },
  { path: "/client/history", requireAuth: true },
  { path: "/server/admin", requireAuth: true, roles: ["admin"] },
  { path: "/auth/login", requireAuth: false, redirectTo: "/" },
  { path: "/auth/register", requireAuth: false, redirectTo: "/" },
];

let refreshInProgress: Promise<NextResponse | null> | null = null;

function findMatchingRule(pathname: string): RouteRule | undefined {
  return ROUTE_CONFIG.find((rule) => pathname.startsWith(rule.path));
}

function createRedirectUrl(path: string, request: NextRequest): URL {
  return new URL(path, request.url);
}

function isTokenValid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = parts[1];
    const decoded = Buffer.from(payload, "base64url").toString("utf-8");
    const data = JSON.parse(decoded);

    if (data.exp) {
      const expTime = data.exp * 1000;
      const now = Date.now();
      const isValid = now < expTime;
      console.log(
        `[Proxy] JWT exp: ${new Date(expTime).toISOString()}, valid: ${isValid}`
      );
      return isValid;
    }

    return true;
  } catch (error) {
    console.error("[Proxy] JWT parse error:", error);
    return false;
  }
}

async function tryRefreshToken(
  request: NextRequest
): Promise<NextResponse | null> {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return null;
  }

  if (refreshInProgress) {
    console.log("[Proxy] Waiting for existing refresh...");
    return refreshInProgress;
  }

  refreshInProgress = doRefresh(refreshToken);

  try {
    return await refreshInProgress;
  } finally {
    refreshInProgress = null;
  }
}

async function doRefresh(refreshToken: string): Promise<NextResponse | null> {
  try {
    console.log("[Proxy] Refreshing tokens...");

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    console.log("[Proxy] Refresh response:", res.status);

    if (!res.ok) {
      const response = NextResponse.next();
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      response.cookies.delete("csrf_token");
      return response;
    }

    const response = NextResponse.next();
    const setCookies = res.headers.getSetCookie();

    for (const cookieString of setCookies) {
      const parsed = parseCookieString(cookieString);
      if (parsed) {
        const maxAge = extractMaxAge(cookieString);
        const httpOnly = cookieString.toLowerCase().includes("httponly");
        const secure = cookieString.toLowerCase().includes("secure");
        const sameSite = extractSameSite(cookieString);

        response.cookies.set(parsed.name, parsed.value, {
          httpOnly,
          secure,
          sameSite,
          path: "/",
          maxAge: maxAge ?? 60 * 60 * 24 * 7,
        });
      }
    }

    console.log("[Proxy] Refresh successful!");
    return response;
  } catch (error) {
    console.error("[Proxy] Refresh error:", error);
    return null;
  }
}

function parseCookieString(
  cookieString: string
): { name: string; value: string } | null {
  const [nameValue] = cookieString.split(";");
  if (!nameValue) return null;

  const equalIndex = nameValue.indexOf("=");
  if (equalIndex === -1) return null;

  return {
    name: nameValue.slice(0, equalIndex).trim(),
    value: nameValue.slice(equalIndex + 1).trim(),
  };
}

function extractMaxAge(cookieString: string): number | undefined {
  const match = cookieString.match(/max-age=(\d+)/i);
  return match ? parseInt(match[1], 10) : undefined;
}

function extractSameSite(
  cookieString: string
): "strict" | "lax" | "none" | undefined {
  const lower = cookieString.toLowerCase();
  if (lower.includes("samesite=strict")) return "strict";
  if (lower.includes("samesite=lax")) return "lax";
  if (lower.includes("samesite=none")) return "none";
  return "lax";
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  let accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Find matching route rule
  const rule = findMatchingRule(pathname);

  // For public routes without auth requirement, skip token refresh
  if (!rule?.requireAuth) {
    console.log(`[Proxy] ${pathname} (public route)`);
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }

  console.log(`\n[Proxy] ${pathname} (protected)`);

  let needsRefresh = false;
  if (accessToken) {
    const tokenValid = isTokenValid(accessToken);
    if (!tokenValid) {
      console.log("[Proxy] Access token expired (JWT check)");
      needsRefresh = true;
      accessToken = undefined;
    }
  } else if (refreshToken) {
    // Only refresh if this is a protected route
    needsRefresh = true;
  }

  if (needsRefresh && refreshToken) {
    const refreshResult = await tryRefreshToken(request);

    if (refreshResult) {
      const newAccessToken = refreshResult.cookies.get("access_token")?.value;

      if (newAccessToken) {
        console.log(
          "[Proxy] Got new access token, redirecting to reload with new cookies"
        );

        const redirectUrl = new URL(pathname, request.url);
        redirectUrl.search = request.nextUrl.search;

        const redirectResponse = NextResponse.redirect(redirectUrl);

        for (const cookie of refreshResult.cookies.getAll()) {
          redirectResponse.cookies.set(cookie.name, cookie.value, {
            httpOnly: cookie.httpOnly,
            secure: cookie.secure,
            sameSite: cookie.sameSite as "strict" | "lax" | "none",
            path: cookie.path,
            maxAge: cookie.maxAge,
          });
        }

        return redirectResponse;
      }
    }
  }

  const isLoggedIn = Boolean(accessToken);

  // rule is already declared above, no need to redeclare
  if (!rule) {
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }

  if (rule.requireAuth && !isLoggedIn) {
    console.log("[Proxy] Auth required, redirecting to login");
    const loginUrl = createRedirectUrl("/auth/login", request);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!rule.requireAuth && rule.redirectTo && isLoggedIn) {
    console.log("[Proxy] Already logged in, redirecting to:", rule.redirectTo);
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
