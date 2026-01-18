"use client";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Switch } from "@/shared/ui/switch";
import { Label } from "@/shared/ui/label";
import type { GenreFilterProps } from "@/features/search/interfaces";

export function GenreFilter({
  genres,
  selectedGenres,
  genreMode,
  onToggleGenre,
  onToggleGenreMode,
  onClearFilters,
}: GenreFilterProps) {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="p-4 rounded-xl bg-card border">
        {/* Header with mode toggle */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">Chọn thể loại:</p>
          {selectedGenres.length > 1 && (
            <div className="flex items-center gap-2">
              <Label
                htmlFor="genre-mode"
                className="text-xs text-muted-foreground"
              >
                {genreMode === "AND" ? "Tất cả" : "Bất kỳ"}
              </Label>
              <Switch
                id="genre-mode"
                checked={genreMode === "AND"}
                onCheckedChange={onToggleGenreMode}
                className="scale-75"
              />
              <span className="text-xs text-muted-foreground">
                {genreMode === "AND"
                  ? "(truyện có tất cả thể loại đã chọn)"
                  : "(truyện có ít nhất 1 thể loại)"}
              </span>
            </div>
          )}
        </div>

        {/* Genre badges */}
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

        {/* Clear button */}
        {selectedGenres.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="mt-3"
          >
            Xóa tất cả bộ lọc ({selectedGenres.length})
          </Button>
        )}
      </div>
    </div>
  );
}
