"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import type { SearchHeaderProps } from "@/features/search/interfaces";

export function SearchHeader({
  query,
  onQueryChange,
  selectedGenresCount,
  showFilters,
  onToggleFilters,
}: SearchHeaderProps) {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <h1 className="text-3xl font-bold text-center mb-6">Tìm Kiếm Truyện</h1>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Nhập tên truyện, tác giả..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-12 pr-12 py-6 text-lg rounded-xl"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
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
          onClick={onToggleFilters}
          className="gap-2 bg-transparent"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Bộ lọc thể loại
          {selectedGenresCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {selectedGenresCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
}
