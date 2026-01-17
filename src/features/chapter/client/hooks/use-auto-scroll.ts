"use client";

import * as React from "react";

interface UseAutoScrollOptions {
  enabled?: boolean;
  initialSpeed?: number;
}

interface UseAutoScrollReturn {
  isScrolling: boolean;
  speed: number;
  start: () => void;
  stop: () => void;
  toggle: () => void;
  setSpeed: (speed: number) => void;
}

const SPEED_MULTIPLIER = 0.5; // pixels per frame at speed 1

/**
 * Hook for auto-scrolling the page (webtoon reading).
 * Speed range: 1-10
 */
export function useAutoScroll({
  enabled = true,
  initialSpeed = 3,
}: UseAutoScrollOptions = {}): UseAutoScrollReturn {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [speed, setSpeed] = React.useState(initialSpeed);
  const rafId = React.useRef<number | null>(null);

  const scroll = React.useCallback(() => {
    window.scrollBy(0, speed * SPEED_MULTIPLIER);
    rafId.current = requestAnimationFrame(scroll);
  }, [speed]);

  const start = React.useCallback(() => {
    if (!enabled || isScrolling) return;
    setIsScrolling(true);
    rafId.current = requestAnimationFrame(scroll);
  }, [enabled, isScrolling, scroll]);

  const stop = React.useCallback(() => {
    setIsScrolling(false);
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, []);

  const toggle = React.useCallback(() => {
    if (isScrolling) stop();
    else start();
  }, [isScrolling, start, stop]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Update scroll speed dynamically
  React.useEffect(() => {
    if (isScrolling) {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(scroll);
    }
  }, [speed, isScrolling, scroll]);

  // Stop on scroll end (bottom of page)
  React.useEffect(() => {
    if (!isScrolling) return;

    const checkEnd = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 50;
      if (atBottom) stop();
    };

    window.addEventListener("scroll", checkEnd);
    return () => window.removeEventListener("scroll", checkEnd);
  }, [isScrolling, stop]);

  return { isScrolling, speed, start, stop, toggle, setSpeed };
}
