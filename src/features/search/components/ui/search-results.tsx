"use client";

import { Search, Loader2 } from "lucide-react";
import { StoryCard } from "@/features/story/components/story-card";
import type { SearchResultsProps } from "@/features/search/interfaces";

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
          <p className="text-lg font-medium">Không tìm thấy kết quả</p>
          <p className="text-muted-foreground">Thử tìm kiếm với từ khóa khác</p>
        </div>
      )}
    </>
  );
}
