"use client";

import * as React from "react";

export type ColorFilter = "none" | "sepia" | "night";

interface ReaderFilters {
  brightness: number;
  colorFilter: ColorFilter;
}

interface UseReaderFiltersReturn extends ReaderFilters {
  setBrightness: (value: number) => void;
  setColorFilter: (filter: ColorFilter) => void;
  filterStyle: React.CSSProperties;
}

const STORAGE_KEY = "reader-filters";

/**
 * Hook to manage reader visual filters (brightness, color)
 * with localStorage persistence.
 */
export function useReaderFilters(): UseReaderFiltersReturn {
  const [filters, setFilters] = React.useState<ReaderFilters>({
    brightness: 100,
    colorFilter: "none",
  });

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ReaderFilters;
        setFilters({
          brightness: parsed.brightness ?? 100,
          colorFilter: parsed.colorFilter ?? "none",
        });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save to localStorage on change
  const saveFilters = React.useCallback((newFilters: ReaderFilters) => {
    setFilters(newFilters);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters));
  }, []);

  const setBrightness = React.useCallback(
    (value: number) => {
      saveFilters({ ...filters, brightness: value });
    },
    [filters, saveFilters],
  );

  const setColorFilter = React.useCallback(
    (filter: ColorFilter) => {
      saveFilters({ ...filters, colorFilter: filter });
    },
    [filters, saveFilters],
  );

  // Generate CSS filter string
  const filterStyle = React.useMemo((): React.CSSProperties => {
    const filterParts: string[] = [];

    // Brightness
    if (filters.brightness !== 100) {
      filterParts.push(`brightness(${filters.brightness / 100})`);
    }

    // Color filters
    switch (filters.colorFilter) {
      case "sepia":
        filterParts.push("sepia(0.3)");
        break;
      case "night":
        filterParts.push("invert(0.9) hue-rotate(180deg)");
        break;
    }

    return filterParts.length > 0 ? { filter: filterParts.join(" ") } : {};
  }, [filters]);

  return {
    ...filters,
    setBrightness,
    setColorFilter,
    filterStyle,
  };
}
