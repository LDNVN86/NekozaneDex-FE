"use client";

import * as React from "react";

interface UseReaderControlsOptions {
  /** Threshold in pixels to trigger hide (default: 50) */
  scrollThreshold?: number;
  /** Initial visibility state (default: true) */
  initialVisible?: boolean;
}

interface UseReaderControlsReturn {
  /** Whether UI should be visible */
  isVisible: boolean;
  /** Toggle visibility manually (for tap) */
  toggle: () => void;
  /** Show UI */
  show: () => void;
  /** Hide UI */
  hide: () => void;
  /** Current scroll progress (0-100) */
  scrollProgress: number;
}

/**
 * Hook to control reader UI visibility
 * - Auto-hide on scroll down (after threshold)
 * - Show on scroll up
 * - Manual toggle (for tap)
 * - Always visible at top/bottom of page
 */
export function useReaderControls(
  options: UseReaderControlsOptions = {}
): UseReaderControlsReturn {
  const { scrollThreshold = 50, initialVisible = true } = options;

  const [isVisible, setIsVisible] = React.useState(initialVisible);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const lastScrollY = React.useRef(0);
  const scrollAccumulator = React.useRef(0);

  const toggle = React.useCallback(() => setIsVisible((v) => !v), []);
  const show = React.useCallback(() => setIsVisible(true), []);
  const hide = React.useCallback(() => setIsVisible(false), []);

  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;

        // Calculate progress
        const progress = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;
        setScrollProgress(Math.min(100, Math.max(0, progress)));

        // Always show at very top or very bottom
        if (currentScrollY < 10 || progress > 98) {
          setIsVisible(true);
          scrollAccumulator.current = 0;
          lastScrollY.current = currentScrollY;
          ticking = false;
          return;
        }

        // Calculate scroll direction and distance
        const scrollDelta = currentScrollY - lastScrollY.current;

        if (scrollDelta > 0) {
          // Scrolling down - accumulate
          scrollAccumulator.current += scrollDelta;
          if (scrollAccumulator.current > scrollThreshold) {
            setIsVisible(false);
          }
        } else if (scrollDelta < 0) {
          // Scrolling up - show immediately
          scrollAccumulator.current = 0;
          setIsVisible(true);
        }

        lastScrollY.current = currentScrollY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  return {
    isVisible,
    toggle,
    show,
    hide,
    scrollProgress,
  };
}
