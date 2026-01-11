"use client";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import type { GenreFilterProps } from "@/features/search/interfaces";

export function GenreFilter({
  genres,
  selectedGenres,
  onToggleGenre,
  onClearFilters,
}: GenreFilterProps) {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="p-4 rounded-xl bg-card border">
        <p className="text-sm font-medium mb-3">Chọn thể loại:</p>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Badge
              key={genre.id}
              variant={
                selectedGenres.includes(genre.slug) ? "default" : "outline"
              }
              className="cursor-pointer transition-colors hover:bg-primary/80"
              onClick={() => onToggleGenre(genre.slug)}
            >
              {genre.name}
            </Badge>
          ))}
        </div>
        {selectedGenres.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="mt-3"
          >
            Xóa tất cả bộ lọc
          </Button>
        )}
      </div>
    </div>
  );
}
