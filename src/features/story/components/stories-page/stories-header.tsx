"use client";

import { Filter, Grid3X3, List, SortAsc } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { FilterContent } from "./filter-sidebar";

const sortOptions = [
  { value: "latest", label: "Mới cập nhật" },
  { value: "views", label: "Lượt xem" },
  { value: "chapters", label: "Số chương" },
  { value: "name", label: "Tên A-Z" },
];

interface StoriesHeaderProps {
  totalResults: number;
  sort: string;
  viewMode: "grid" | "list";
  selectedGenres: string[];
  status: string;
  onSortChange: (sort: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  onGenreToggle: (genreId: string) => void;
  onStatusChange: (status: string) => void;
  onApplyFilters: () => void;
}

export function StoriesHeader({
  totalResults,
  sort,
  viewMode,
  selectedGenres,
  status,
  onSortChange,
  onViewModeChange,
  onGenreToggle,
  onStatusChange,
  onApplyFilters,
}: StoriesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">Danh sách truyện</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {totalResults.toLocaleString("vi-VN")} kết quả
        </p>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden bg-transparent"
            >
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <SheetHeader>
              <SheetTitle>Bộ lọc</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent
                selectedGenres={selectedGenres}
                status={status}
                onGenreToggle={onGenreToggle}
                onStatusChange={onStatusChange}
                onApplyFilters={onApplyFilters}
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Sort */}
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[160px]">
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
        <div className="hidden sm:flex items-center border rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewModeChange("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewModeChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
