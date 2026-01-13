import "server-only";

export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = Buffer.from(payload, "base64url").toString("utf-8");
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

/**
 * Check if token is valid with optional buffer time
 * @param token JWT token
 * @param bufferSeconds Seconds before actual expiry to consider invalid (default 60)
 * @returns true if token is valid and not expiring soon
 */
export function isTokenValid(token: string, bufferSeconds = 60): boolean {
  const exp = getTokenExpiry(token);
  if (!exp) return false;

  const nowSeconds = Math.floor(Date.now() / 1000);
  return exp - bufferSeconds > nowSeconds;
}

export function getTokenTimeRemaining(token: string): number {
  const exp = getTokenExpiry(token);
  if (!exp) return 0;

  const nowSeconds = Math.floor(Date.now() / 1000);
  return Math.max(0, exp - nowSeconds);
}
