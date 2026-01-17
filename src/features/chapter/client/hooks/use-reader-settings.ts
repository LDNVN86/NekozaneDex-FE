"use client";

import * as React from "react";
import type { PageFitMode, ReadingMode } from "../ui/reader-settings";

const STORAGE_KEYS = {
  readingMode: "reader-mode",
  pageFit: "reader-page-fit",
} as const;

interface ReaderSettings {
  readingMode: ReadingMode;
  pageFit: PageFitMode;
  isLoaded: boolean;
}

interface UseReaderSettingsReturn extends ReaderSettings {
  setReadingMode: (mode: ReadingMode) => void;
  setPageFit: (fit: PageFitMode) => void;
}

/**
 * Hook to manage reader settings with localStorage persistence.
 * Loads settings after mount to avoid hydration mismatch.
 */
export function useReaderSettings(): UseReaderSettingsReturn {
  const [settings, setSettings] = React.useState<ReaderSettings>({
    readingMode: "vertical",
    pageFit: "width",
    isLoaded: false,
  });

  // Load from localStorage after mount
  React.useEffect(() => {
    const savedMode = localStorage.getItem(STORAGE_KEYS.readingMode);
    const savedFit = localStorage.getItem(STORAGE_KEYS.pageFit);

    setSettings({
      readingMode: isValidMode(savedMode) ? savedMode : "vertical",
      pageFit: isValidFit(savedFit) ? savedFit : "width",
      isLoaded: true,
    });
  }, []);

  const setReadingMode = React.useCallback((mode: ReadingMode) => {
    localStorage.setItem(STORAGE_KEYS.readingMode, mode);
    setSettings((prev) => ({ ...prev, readingMode: mode }));
  }, []);

  const setPageFit = React.useCallback((fit: PageFitMode) => {
    localStorage.setItem(STORAGE_KEYS.pageFit, fit);
    setSettings((prev) => ({ ...prev, pageFit: fit }));
  }, []);

  return { ...settings, setReadingMode, setPageFit };
}

// Type guards
function isValidMode(value: string | null): value is ReadingMode {
  return (
    value === "vertical" || value === "horizontal" || value === "longstrip"
  );
}

function isValidFit(value: string | null): value is PageFitMode {
  return value === "width" || value === "height" || value === "original";
}
