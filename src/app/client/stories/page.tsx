"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { StoryCard } from "@/features/story/components/story-card";
import { mockStories } from "@/features/story/data/mock-data";
import { cn } from "@/shared/lib/utils";
import {
  FilterSidebar,
  StoriesHeader,
  ActiveFilters,
  Pagination,
} from "@/features/story/components/stories-page";

export default function StoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedGenres, setSelectedGenres] = React.useState<string[]>(
    searchParams.get("genre")?.split(",").filter(Boolean) || []
  );
  const [status, setStatus] = React.useState(
    searchParams.get("status") || "all"
  );
  const [sort, setSort] = React.useState(searchParams.get("sort") || "latest");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = 10;
  const totalResults = mockStories.length * totalPages;

  const toggleGenre = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((g) => g !== genreId)
        : [...prev, genreId]
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedGenres.length > 0)
      params.set("genre", selectedGenres.join(","));
    if (status !== "all") params.set("status", status);
    if (sort !== "latest") params.set("sort", sort);
    router.push(`/stories?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar
          selectedGenres={selectedGenres}
          status={status}
          onGenreToggle={toggleGenre}
          onStatusChange={setStatus}
          onApplyFilters={applyFilters}
        />

        <div className="flex-1">
          <StoriesHeader
            totalResults={totalResults}
            sort={sort}
            viewMode={viewMode}
            selectedGenres={selectedGenres}
            status={status}
            onSortChange={setSort}
            onViewModeChange={setViewMode}
            onGenreToggle={toggleGenre}
            onStatusChange={setStatus}
            onApplyFilters={applyFilters}
          />

          <ActiveFilters
            selectedGenres={selectedGenres}
            onGenreToggle={toggleGenre}
            onClearAll={() => setSelectedGenres([])}
          />

          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
                : "flex flex-col gap-4"
            )}
          >
            {mockStories.map((story) => (
              <StoryCard
                key={story.id}
                {...story}
                className={viewMode === "list" ? "flex-row h-32" : ""}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
