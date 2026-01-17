"use client";

import * as React from "react";
import {
  saveLocalProgress,
  getLocalProgress,
  syncToServer,
  syncBeacon,
} from "@/features/reading-history";

interface UseHorizontalProgressOptions {
  storyId: string;
  chapterId: string;
  totalPages: number;
  enabled?: boolean;
}

interface UseHorizontalProgressReturn {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  syncOnUnload: () => void;
}

/**
 * Hook to manage horizontal/book reading progress.
 * Saves page position as percentage for compatibility with backend.
 */
export function useHorizontalProgress({
  storyId,
  chapterId,
  totalPages,
  enabled = true,
}: UseHorizontalProgressOptions): UseHorizontalProgressReturn {
  const [currentPage, setCurrentPageState] = React.useState(0);
  const lastSyncRef = React.useRef(0);

  // Load saved position on mount
  React.useEffect(() => {
    if (!enabled || !storyId) return;

    const saved = getLocalProgress(storyId);
    if (saved && saved.chapterId === chapterId && totalPages > 0) {
      // Convert percentage back to page number
      const page = Math.floor((saved.scrollPosition / 100) * totalPages);
      setCurrentPageState(Math.min(page, totalPages - 1));
    }
  }, [storyId, chapterId, totalPages, enabled]);

  // Save on page change
  const setCurrentPage = React.useCallback(
    (page: number) => {
      setCurrentPageState(page);
      if (!enabled || totalPages === 0) return;

      const percent = Math.round((page / totalPages) * 100);
      saveLocalProgress(storyId, chapterId, percent);

      // Sync to server at key points: first, last, every 5 pages
      const shouldSync =
        page === 0 || page === totalPages - 1 || page % 5 === 0;
      if (shouldSync && Date.now() - lastSyncRef.current > 5000) {
        lastSyncRef.current = Date.now();
        syncToServer({ storyId, chapterId, scrollPosition: percent });
      }
    },
    [storyId, chapterId, totalPages, enabled],
  );

  // Sync on unload
  const syncOnUnload = React.useCallback(() => {
    if (!enabled || totalPages === 0) return;
    const percent = Math.round((currentPage / totalPages) * 100);
    syncBeacon(storyId, chapterId, percent);
  }, [storyId, chapterId, totalPages, currentPage, enabled]);

  // Register unload handler
  React.useEffect(() => {
    if (!enabled) return;
    window.addEventListener("beforeunload", syncOnUnload);
    return () => window.removeEventListener("beforeunload", syncOnUnload);
  }, [syncOnUnload, enabled]);

  return { currentPage, setCurrentPage, syncOnUnload };
}
