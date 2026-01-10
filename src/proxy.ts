import { NextResponse, NextRequest } from "next/server";

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

  // Admin routes
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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const isLoggedIn = Boolean(accessToken);

  const rule = findMatchingRule(pathname);
  if (!rule) return NextResponse.next();

  if (rule.requireAuth && !isLoggedIn) {
    const loginUrl = createRedirectUrl("/auth/login", request);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!rule.requireAuth && rule.redirectTo && isLoggedIn) {
    return NextResponse.redirect(createRedirectUrl(rule.redirectTo, request));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/client/profile/:path*",
    "/client/bookmarks/:path*",
    "/client/history/:path*",
    "/server/admin/:path*",
    "/auth/login/:path*",
    "/auth/register/:path*",
  ],
};
