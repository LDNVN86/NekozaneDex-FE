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

function getAccessTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
}

export function TokenRefreshProvider({ children }: TokenRefreshProviderProps) {
  const refreshingRef = React.useRef(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const checkAndRefresh = React.useCallback(async () => {
    if (refreshingRef.current) return;

    const token = getAccessTokenFromCookie();
    if (!token) return;

    if (!shouldRefreshToken(token)) return;

    console.log("[TokenRefresh] Token expiring soon, refreshing...");
    refreshingRef.current = true;

    try {
      const success = await refreshTokens();
      if (success) {
        console.log("[TokenRefresh] Refresh successful");
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

  const scheduleNextCheck = React.useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }

    const token = getAccessTokenFromCookie();
    if (!token) return;
    const interval = getRefreshInterval(token);
    console.log(`[TokenRefresh] Next check in ${interval}ms`);

    intervalRef.current = setTimeout(() => {
      checkAndRefresh();
    }, interval);
  }, [checkAndRefresh]);

  React.useEffect(() => {
    const token = getAccessTokenFromCookie();
    if (token) {
      if (isTokenExpired(token)) {
        checkAndRefresh();
      } else {
        scheduleNextCheck();
      }
    }

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        console.log("[TokenRefresh] Tab visible, checking token...");
        checkAndRefresh();
      }
    };

    const handleOnline = () => {
      console.log("[TokenRefresh] Network online, checking token...");
      checkAndRefresh();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("online", handleOnline);

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
