"use client";

import { Button } from "@/shared/ui/button";
import type { Genre } from "@/features/story/interface/story-interface";

interface ActiveFiltersProps {
  genres: Genre[];
  selectedGenres: string[];
  onGenreToggle: (genreSlug: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  genres,
  selectedGenres,
  onGenreToggle,
  onClearAll,
}: ActiveFiltersProps) {
  if (selectedGenres.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {selectedGenres.map((genreSlug) => {
        const genre = genres.find((g) => g.slug === genreSlug);
        return (
          <Button
            key={genreSlug}
            variant="secondary"
            size="sm"
            onClick={() => onGenreToggle(genreSlug)}
            className="gap-1"
          >
            {genre?.name || genreSlug}
            <span className="ml-1">×</span>
          </Button>
        );
      })}
      <Button variant="ghost" size="sm" onClick={onClearAll}>
        Xóa tất cả
      </Button>
    </div>
  );
}
