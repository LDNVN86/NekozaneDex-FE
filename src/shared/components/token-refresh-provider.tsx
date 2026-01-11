"use client";

import { useTokenRefresh } from "@/shared/hooks/use-token-refresh";

interface TokenRefreshProviderProps {
  children: React.ReactNode;
  /** Whether to enable auto-refresh (default: true) */
  enabled?: boolean;
  /** Check interval in ms (default: 5 minutes) */
  intervalMs?: number;
}

/**
 * Provider component that sets up automatic token refresh
 * Wrap your app or protected layouts with this component
 *
 * @example
 * ```tsx
 * <TokenRefreshProvider>
 *   <YourApp />
 * </TokenRefreshProvider>
 * ```
 */
export function TokenRefreshProvider({
  children,
  enabled = true,
  intervalMs = 5 * 60 * 1000,
}: TokenRefreshProviderProps) {
  useTokenRefresh(enabled, intervalMs);

  return <>{children}</>;
}
