"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SearchContentProps } from "@/features/search/interfaces";
import {
  SearchHeader,
  GenreFilter,
  SearchResults,
  SearchPagination,
} from "./ui";

export function SearchContent({
  initialStories,
  genres,
  totalPages,
  currentPage,
  total,
  initialQuery,
  initialGenres,
}: SearchContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(initialQuery);
  const [selectedGenres, setSelectedGenres] =
    React.useState<string[]>(initialGenres);
  const [showFilters, setShowFilters] = React.useState(
    initialGenres.length > 0
  );
  const [isSearching, setIsSearching] = React.useState(false);

  // Debounced search - compare URLs to prevent infinite loop
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();

      if (query) {
        params.set("q", query);
      }

      if (selectedGenres.length > 0) {
        params.set("genres", selectedGenres.join(","));
      }

      const newUrl = `/client/search?${params.toString()}`;
      const currentUrl = `/client/search?${searchParams.toString()}`;

      // Only push if URL actually changed
      if (newUrl !== currentUrl) {
        router.push(newUrl);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, selectedGenres, router, searchParams]);

  const toggleGenre = (genreSlug: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreSlug)
        ? prev.filter((g) => g !== genreSlug)
        : [...prev, genreSlug]
    );
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedGenres([]);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/client/search?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchHeader
        query={query}
        onQueryChange={setQuery}
        selectedGenresCount={selectedGenres.length}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {showFilters && (
        <GenreFilter
          genres={genres}
          selectedGenres={selectedGenres}
          onToggleGenre={toggleGenre}
          onClearFilters={clearFilters}
        />
      )}

      <SearchResults
        stories={initialStories}
        query={query}
        selectedGenresCount={selectedGenres.length}
        total={total}
        isSearching={isSearching}
      />

      <SearchPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </div>
  );
}
