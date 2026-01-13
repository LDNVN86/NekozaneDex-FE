"use client";

import * as React from "react";
import {
  shouldRefreshToken,
  getRefreshInterval,
  isTokenExpired,
} from "@/shared/lib/shared-token-utils";
import { refreshTokens } from "@/shared/lib/client-fetch";

interface TokenRefreshProviderProps {
  children: React.ReactNode;
}

/**
 * Get access token from cookie (client-side)
 */
function getAccessTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Provider component that sets up automatic token refresh
 * Features:
 * - Adaptive interval based on token TTL
 * - Tab visibility change detection
 * - Network online detection
 * - Graceful error handling with retry
 */
export function TokenRefreshProvider({ children }: TokenRefreshProviderProps) {
  const refreshingRef = React.useRef(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Check and refresh if needed
  const checkAndRefresh = React.useCallback(async () => {
    // Prevent concurrent refreshes
    if (refreshingRef.current) return;

    const token = getAccessTokenFromCookie();
    if (!token) return; // Not logged in

    // Check if token needs refresh
    if (!shouldRefreshToken(token)) return;

    console.log("[TokenRefresh] Token expiring soon, refreshing...");
    refreshingRef.current = true;

    try {
      const success = await refreshTokens();
      if (success) {
        console.log("[TokenRefresh] Refresh successful");
        // Schedule next check with new token
        scheduleNextCheck();
      } else {
        console.warn("[TokenRefresh] Refresh failed");
      }
    } catch (error) {
      console.error("[TokenRefresh] Error:", error);
    } finally {
      refreshingRef.current = false;
    }
  }, []);

  // Schedule next check based on current token
  const scheduleNextCheck = React.useCallback(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }

    const token = getAccessTokenFromCookie();
    if (!token) return;

    // Get adaptive interval
    const interval = getRefreshInterval(token);
    console.log(`[TokenRefresh] Next check in ${interval}ms`);

    intervalRef.current = setTimeout(() => {
      checkAndRefresh();
    }, interval);
  }, [checkAndRefresh]);

  React.useEffect(() => {
    // Initial check
    const token = getAccessTokenFromCookie();
    if (token) {
      // If token already expired, refresh immediately
      if (isTokenExpired(token)) {
        checkAndRefresh();
      } else {
        scheduleNextCheck();
      }
    }

    // Tab visibility change handler
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        console.log("[TokenRefresh] Tab visible, checking token...");
        checkAndRefresh();
      }
    };

    // Network online handler
    const handleOnline = () => {
      console.log("[TokenRefresh] Network online, checking token...");
      checkAndRefresh();
    };

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("online", handleOnline);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("online", handleOnline);
    };
  }, [checkAndRefresh, scheduleNextCheck]);

  return <>{children}</>;
}
