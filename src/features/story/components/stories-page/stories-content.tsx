"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StoryCard } from "@/features/story/components/story-card";
import { cn } from "@/shared/lib/utils";
import { FilterSidebar } from "./filter-sidebar";
import { StoriesHeader } from "./stories-header";
import { ActiveFilters } from "./active-filters";
import { Pagination } from "./pagination";
import type { Story, Genre } from "@/features/story/interface/story-interface";

interface StoriesContentProps {
  initialStories: Story[];
  genres: Genre[];
  totalPages: number;
  currentPage: number;
  total: number;
  initialGenres: string[];
  initialStatus: string;
  initialSort: string;
}

export function StoriesContent({
  initialStories,
  genres,
  totalPages,
  currentPage,
  total,
  initialGenres,
  initialStatus,
  initialSort,
}: StoriesContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedGenres, setSelectedGenres] =
    React.useState<string[]>(initialGenres);
  const [status, setStatus] = React.useState(initialStatus);
  const [sort, setSort] = React.useState(initialSort);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const toggleGenre = (genreSlug: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreSlug)
        ? prev.filter((g) => g !== genreSlug)
        : [...prev, genreSlug]
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedGenres.length > 0)
      params.set("genre", selectedGenres.join(","));
    if (status !== "all") params.set("status", status);
    if (sort !== "latest") params.set("sort", sort);
    router.push(`/client/stories?${params.toString()}`);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/client/stories?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar
          genres={genres}
          selectedGenres={selectedGenres}
          status={status}
          onGenreToggle={toggleGenre}
          onStatusChange={setStatus}
          onApplyFilters={applyFilters}
        />

        <div className="flex-1">
          <StoriesHeader
            totalResults={total}
            sort={sort}
            viewMode={viewMode}
            genres={genres}
            selectedGenres={selectedGenres}
            status={status}
            onSortChange={setSort}
            onViewModeChange={setViewMode}
            onGenreToggle={toggleGenre}
            onStatusChange={setStatus}
            onApplyFilters={applyFilters}
          />

          <ActiveFilters
            genres={genres}
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
            {initialStories.map((story) => (
              <StoryCard
                key={story.id}
                id={story.id}
                title={story.title}
                slug={story.slug}
                coverUrl={story.cover_image_url}
                chapterCount={story.total_chapters}
                viewCount={story.view_count}
                status={story.status === "paused" ? "ongoing" : story.status}
                className={viewMode === "list" ? "flex-row h-32" : ""}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      </div>
    </div>
  );
}
