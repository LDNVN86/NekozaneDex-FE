"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X, Grid3X3, List, SortAsc } from "lucide-react";
import { StoryCard } from "@/features/story/components/story-card";
import { Skeleton } from "@/shared/ui/skeleton";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/lib/utils";
import { FilterPopover } from "./filter-popover";
import { ActiveFilters } from "./active-filters";
import { Pagination } from "./pagination";
import type { Story, Genre } from "@/features/story/interface/story-interface";

const sortOptions = [
  { value: "latest", label: "Mới cập nhật" },
  { value: "popular", label: "Lượt xem" },
  { value: "name", label: "Tên A-Z" },
  { value: "rating", label: "Đánh giá" },
];

interface StoriesContentProps {
  initialStories: Story[];
  genres: Genre[];
  totalPages: number;
  currentPage: number;
  total: number;
  initialGenres: string[];
  initialStatus: string;
  initialSort: string;
  initialQuery?: string;
}

// Skeleton for story cards
function StoryCardSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
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
  initialQuery = "",
}: StoriesContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const [query, setQuery] = React.useState(initialQuery);
  const [selectedGenres, setSelectedGenres] =
    React.useState<string[]>(initialGenres);
  const [status, setStatus] = React.useState(initialStatus);
  const [sort, setSort] = React.useState(initialSort);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  // Sync with URL on changes
  React.useEffect(() => {
    setQuery(initialQuery);
    setSelectedGenres(initialGenres);
    setStatus(initialStatus);
    setSort(initialSort);
  }, [initialQuery, initialGenres, initialStatus, initialSort]);

  // Build URL and navigate
  const navigateWithFilters = React.useCallback(
    (
      overrides: {
        q?: string;
        genres?: string[];
        status?: string;
        sort?: string;
      } = {},
    ) => {
      const params = new URLSearchParams();
      const q = overrides.q ?? query;
      const g = overrides.genres ?? selectedGenres;
      const s = overrides.status ?? status;
      const so = overrides.sort ?? sort;

      if (q) params.set("q", q);
      if (g.length > 0) params.set("genre", g.join(","));
      if (s !== "all") params.set("status", s);
      if (so !== "latest") params.set("sort", so);

      startTransition(() => {
        router.push(`/client/stories?${params.toString()}`);
      });
    },
    [query, selectedGenres, status, sort, router],
  );

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== initialQuery) {
        navigateWithFilters({ q: query });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query, initialQuery, navigateWithFilters]);

  const toggleGenre = (genreSlug: string) => {
    const newGenres = selectedGenres.includes(genreSlug)
      ? selectedGenres.filter((g) => g !== genreSlug)
      : [...selectedGenres, genreSlug];
    setSelectedGenres(newGenres);
    navigateWithFilters({ genres: newGenres });
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    navigateWithFilters({ status: newStatus });
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    navigateWithFilters({ sort: newSort });
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setStatus("all");
    navigateWithFilters({ genres: [], status: "all" });
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));

    startTransition(() => {
      router.push(`/client/stories?${params.toString()}`);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Danh sách truyện</h1>
        <p className="text-muted-foreground">
          {(total ?? 0).toLocaleString("vi-VN")} truyện
          {query && <span> • Kết quả cho &quot;{query}&quot;</span>}
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kiếm truyện..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 h-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => {
                setQuery("");
                navigateWithFilters({ q: "" });
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Popover */}
          <FilterPopover
            genres={genres}
            selectedGenres={selectedGenres}
            status={status}
            onGenreToggle={toggleGenre}
            onStatusChange={handleStatusChange}
            onClearAll={clearAllFilters}
          />

          {/* Sort Select */}
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px] h-9">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center border rounded-lg p-0.5">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters
        genres={genres}
        selectedGenres={selectedGenres}
        onGenreToggle={toggleGenre}
        onClearAll={clearAllFilters}
      />

      {/* Loading overlay */}
      <div className="relative min-h-[400px]">
        {isPending && (
          <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Đang tải...</span>
            </div>
          </div>
        )}

        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
              : "flex flex-col gap-4",
            isPending && "opacity-50 pointer-events-none",
          )}
        >
          {isPending
            ? Array.from({ length: 20 }).map((_, i) => (
                <StoryCardSkeleton key={i} />
              ))
            : initialStories.map((story, index) => (
                <div
                  key={story.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <StoryCard
                    id={story.id}
                    title={story.title}
                    slug={story.slug}
                    coverUrl={story.cover_image_url}
                    chapterCount={story.total_chapters}
                    viewCount={story.view_count}
                    status={
                      story.status === "paused" ? "ongoing" : story.status
                    }
                    isListView={viewMode === "list"}
                  />
                </div>
              ))}
        </div>

        {/* Empty state */}
        {!isPending && initialStories.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium mb-2">Không tìm thấy kết quả</p>
            <p className="text-muted-foreground mb-4">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
            <Button variant="outline" onClick={clearAllFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </div>
  );
}
