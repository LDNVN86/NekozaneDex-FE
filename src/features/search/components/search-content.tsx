"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { StoryCard } from "@/features/story/components/story-card";
import { mockStories, genres } from "@/features/story/data/mock-data";

export function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = React.useState(initialQuery);
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);

  // Filter stories based on search query and selected genres
  const filteredStories = mockStories.filter((story) => {
    const matchesQuery =
      query === "" ||
      story.title.toLowerCase().includes(query.toLowerCase()) ||
      story.author.toLowerCase().includes(query.toLowerCase());

    const matchesGenres =
      selectedGenres.length === 0 ||
      story.genres.some((g) => selectedGenres.includes(g.toLowerCase()));

    return matchesQuery && matchesGenres;
  });

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">Tìm Kiếm Truyện</h1>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Nhập tên truyện, tác giả..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-12 py-6 text-lg rounded-xl"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 bg-transparent"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Bộ lọc thể loại
          </Button>
        </div>

        {/* Genre Filters */}
        {showFilters && (
          <div className="mt-4 p-4 rounded-xl bg-card border">
            <p className="text-sm font-medium mb-3">Chọn thể loại:</p>
            <div className="flex flex-wrap gap-2">
              {genres.slice(0, 10).map((genre) => (
                <Badge
                  key={genre.id}
                  variant={
                    selectedGenres.includes(genre.name.toLowerCase())
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer transition-colors"
                  onClick={() => toggleGenre(genre.name.toLowerCase())}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
            {selectedGenres.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedGenres([])}
                className="mt-3"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        <p className="text-muted-foreground mb-6">
          {query || selectedGenres.length > 0
            ? `Tìm thấy ${filteredStories.length} kết quả`
            : "Nhập từ khóa để tìm kiếm"}
        </p>

        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {filteredStories.map((story) => (
              <StoryCard key={story.id} {...story} />
            ))}
          </div>
        ) : query || selectedGenres.length > 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">Không tìm thấy kết quả</p>
            <p className="text-muted-foreground">
              Thử tìm kiếm với từ khóa khác
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {mockStories.map((story) => (
              <StoryCard key={story.id} {...story} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
