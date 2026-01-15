"use client";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";
export const STORAGE_KEY = "reading_progress";
export const SYNC_INTERVAL = 180000; // 3 minutes

export interface SaveProgressParams {
  storyId: string;
  chapterId: string;
  scrollPosition?: number;
}

export interface LocalProgress {
  storyId: string;
  chapterId: string;
  scrollPosition: number;
  timestamp: number;
}

/**
 * Get stored progress from localStorage
 */
export function getLocalProgress(storyId: string): LocalProgress | null {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY}_${storyId}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Save progress to localStorage (instant, no network)
 */
export function saveLocalProgress(
  storyId: string,
  chapterId: string,
  scrollPosition: number
) {
  try {
    const data: LocalProgress = {
      storyId,
      chapterId,
      scrollPosition,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${STORAGE_KEY}_${storyId}`, JSON.stringify(data));
  } catch {
    // localStorage might be full or disabled
  }
}

/**
 * Sync progress to server
 */
export async function syncToServer({
  storyId,
  chapterId,
  scrollPosition = 0,
}: SaveProgressParams): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/reading-history`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        story_id: storyId,
        chapter_id: chapterId,
        scroll_position: scrollPosition,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Sync using sendBeacon (for page unload)
 */
export function syncBeacon(
  storyId: string,
  chapterId: string,
  scrollPosition: number
) {
  if (typeof navigator === "undefined" || !navigator.sendBeacon) return;

  const data = JSON.stringify({
    story_id: storyId,
    chapter_id: chapterId,
    scroll_position: scrollPosition,
  });

  navigator.sendBeacon(
    `${API_URL}/reading-history`,
    new Blob([data], { type: "application/json" })
  );
}

/**
 * Get current scroll progress as percentage (0-100)
 */
export function getScrollProgress(): number {
  if (typeof window === "undefined") return 0;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return 0;
  return Math.round((scrollTop / docHeight) * 100);
}

/**
 * Throttle function - execute at most once per wait ms
 */
export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  wait: number
): T {
  let lastTime = 0;
  return ((...args: any[]) => {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn(...args);
    }
  }) as T;
}
