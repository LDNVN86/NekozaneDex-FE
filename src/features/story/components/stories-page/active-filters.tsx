import { Button } from "@/shared/ui/button";
import { genres } from "@/features/story/data/mock-data";

interface ActiveFiltersProps {
  selectedGenres: string[];
  onGenreToggle: (genreId: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  selectedGenres,
  onGenreToggle,
  onClearAll,
}: ActiveFiltersProps) {
  if (selectedGenres.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {selectedGenres.map((genreId) => {
        const genre = genres.find((g) => g.id === genreId);
        return (
          <Button
            key={genreId}
            variant="secondary"
            size="sm"
            onClick={() => onGenreToggle(genreId)}
            className="gap-1"
          >
            {genre?.name}
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
