function decodeBase64Url(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");

  if (typeof window !== "undefined" && typeof atob === "function") {
    return atob(base64);
  } else {
    return Buffer.from(base64, "base64").toString("utf-8");
  }
}

export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = decodeBase64Url(parts[1]);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getTokenExpiry(token: string): number | null {
  const payload = parseJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return null;
  return payload.exp;
}

export function getTokenIssuedAt(token: string): number | null {
  const payload = parseJwtPayload(token);
  if (!payload || typeof payload.iat !== "number") return null;
  return payload.iat;
}

export function getTokenTTL(token: string): number {
  const exp = getTokenExpiry(token);
  const iat = getTokenIssuedAt(token);
  if (!exp || !iat) return 0;
  return exp - iat;
}

export function getTokenTimeRemaining(token: string): number {
  const exp = getTokenExpiry(token);
  if (!exp) return 0;

  const nowSeconds = Math.floor(Date.now() / 1000);
  return Math.max(0, exp - nowSeconds);
}

export function isTokenExpired(token: string): boolean {
  return getTokenTimeRemaining(token) === 0;
}

export function shouldRefreshToken(token: string): boolean {
  const remaining = getTokenTimeRemaining(token);
  if (remaining === 0) return true;

  const ttl = getTokenTTL(token);
  const threshold = Math.max(2, ttl * 0.2);

  return remaining < threshold;
}

export function getRefreshInterval(token: string): number {
  const remaining = getTokenTimeRemaining(token);
  if (remaining <= 0) return 1000;
  const intervalSeconds = remaining / 3;

  const clampedSeconds = Math.min(Math.max(intervalSeconds, 1), 120);

  return Math.floor(clampedSeconds * 1000);
}
