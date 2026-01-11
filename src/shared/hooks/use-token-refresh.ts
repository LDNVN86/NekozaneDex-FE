"use client";

import { useEffect } from "react";
import { setupTokenRefreshInterval } from "@/shared/lib/client-fetch";

/**
 * Hook to setup automatic token refresh
 * Use this in your root layout or auth-required layouts
 *
 * @param enabled Whether to enable auto-refresh (default: true)
 * @param intervalMs Check interval in ms (default: 5 minutes)
 */
export function useTokenRefresh(enabled = true, intervalMs = 5 * 60 * 1000) {
  useEffect(() => {
    if (!enabled) return;

    const cleanup = setupTokenRefreshInterval(intervalMs);

    return cleanup;
  }, [enabled, intervalMs]);
}
