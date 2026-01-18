"use client";

import { Search, Loader2, Sparkles } from "lucide-react";
import { StoryCard } from "@/features/story/components/story-card";
import type { SearchResultsProps } from "@/features/search/interfaces";
import { Badge } from "@/shared/ui/badge";

// Popular genre suggestions
const popularGenres = [
  { slug: "action", name: "Hành động" },
  { slug: "romance", name: "Tình cảm" },
  { slug: "fantasy", name: "Fantasy" },
  { slug: "comedy", name: "Hài hước" },
  { slug: "adventure", name: "Phiêu lưu" },
  { slug: "shounen", name: "Shounen" },
];

export function SearchResults({
  stories,
  query,
  selectedGenresCount,
  total,
  isSearching,
}: SearchResultsProps) {
  return (
    <>
      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          {query || selectedGenresCount > 0
            ? `Tìm thấy ${total} kết quả`
            : `Hiển thị ${stories.length} truyện`}
        </p>
        {isSearching && (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Results Grid */}
      {stories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              id={story.id}
              title={story.title}
              slug={story.slug}
              coverUrl={story.cover_image_url}
              chapterCount={story.total_chapters}
              viewCount={story.view_count}
              status={story.status === "paused" ? "ongoing" : story.status}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-lg font-medium mb-2">Không tìm thấy kết quả</p>
          <p className="text-muted-foreground mb-6">
            {query
              ? `Không có truyện nào phù hợp với "${query}"`
              : "Thử tìm kiếm với từ khóa khác"}
          </p>

          {/* Search tips */}
          <div className="max-w-md mx-auto bg-muted/30 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-medium mb-2">💡 Gợi ý tìm kiếm:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Thử dùng tên tiếng Nhật/Hán nếu có</li>
              <li>• Kiểm tra chính tả</li>
              <li>• Dùng ít từ khóa hơn</li>
            </ul>
          </div>

          {/* Popular genres */}
          <div className="max-w-lg mx-auto">
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
              <Sparkles className="h-4 w-4" />
              Có thể bạn quan tâm
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularGenres.map((genre) => (
                <a key={genre.slug} href={`/client/genres/${genre.slug}`}>
                  <Badge
                    variant="secondary"
                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                  >
                    {genre.name}
                  </Badge>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
