"use client";

import * as React from "react";
import {
  SYNC_INTERVAL,
  getLocalProgress,
  saveLocalProgress,
  syncToServer,
  syncBeacon,
  getScrollProgress,
  throttle,
} from "./reading-progress-utils";

// Export for client-side use
export { saveLocalProgress, getLocalProgress };

/**
 * Hook to auto-save reading progress
 *
 * Strategy:
 * - localStorage: Save on every scroll (throttled 200ms) - instant, no network
 * - Server sync: Only on mount, every 3 minutes, and page unload
 */
export function useReadingProgress(
  storyId: string | undefined,
  chapterId: string | undefined,
  enabled = true
) {
  const storyIdRef = React.useRef(storyId);
  const chapterIdRef = React.useRef(chapterId);
  const lastSyncedRef = React.useRef(0);

  // Keep refs in sync
  React.useEffect(() => {
    storyIdRef.current = storyId;
    chapterIdRef.current = chapterId;
  }, [storyId, chapterId]);

  // Throttled localStorage save on scroll
  React.useEffect(() => {
    if (!enabled || !storyId || !chapterId) return;

    const throttledSave = throttle(() => {
      const sId = storyIdRef.current;
      const cId = chapterIdRef.current;
      if (sId && cId) {
        const scroll = getScrollProgress();
        saveLocalProgress(sId, cId, scroll);
      }
    }, 200);

    window.addEventListener("scroll", throttledSave, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledSave);
    };
  }, [enabled, storyId, chapterId]);

  // Sync to server: on mount and every 3 minutes
  React.useEffect(() => {
    if (!enabled || !storyId || !chapterId) return;

    // Initial sync after 2 seconds
    const initTimer = setTimeout(() => {
      const scroll = getScrollProgress();
      syncToServer({ storyId, chapterId, scrollPosition: scroll });
      lastSyncedRef.current = Date.now();
    }, 2000);

    // Periodic sync every 3 minutes
    const syncInterval = setInterval(() => {
      const sId = storyIdRef.current;
      const cId = chapterIdRef.current;
      if (sId && cId) {
        const local = getLocalProgress(sId);
        if (local && local.timestamp > lastSyncedRef.current) {
          syncToServer({
            storyId: sId,
            chapterId: cId,
            scrollPosition: local.scrollPosition,
          });
          lastSyncedRef.current = Date.now();
        }
      }
    }, SYNC_INTERVAL);

    return () => {
      clearTimeout(initTimer);
      clearInterval(syncInterval);
    };
  }, [enabled, storyId, chapterId]);

  // Sync on page unload
  React.useEffect(() => {
    if (!enabled || !storyId || !chapterId) return;

    const handleUnload = () => {
      const sId = storyIdRef.current;
      const cId = chapterIdRef.current;
      if (sId && cId) {
        const scroll = getScrollProgress();
        syncBeacon(sId, cId, scroll);
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [enabled, storyId, chapterId]);
}
