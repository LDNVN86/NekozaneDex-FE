"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Filter,
  Grid3X3,
  List,
  SortAsc,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/shared/ui/radio-group";
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
import { Checkbox } from "@/shared/ui/checkbox";
import { StoryCard } from "@/features/story/components/story-card";
import { mockStories, genres } from "@/features/story/data/mock-data";
import { cn } from "@/shared/lib/utils";

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "ongoing", label: "Đang ra" },
  { value: "completed", label: "Hoàn thành" },
];

const sortOptions = [
  { value: "latest", label: "Mới cập nhật" },
  { value: "views", label: "Lượt xem" },
  { value: "chapters", label: "Số chương" },
  { value: "name", label: "Tên A-Z" },
];

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

  const totalPages = 10; // Mock total pages
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

  const FilterContent = () => (
    <div className="flex flex-col gap-6">
      {/* Genre Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Thể loại</Label>
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
          {genres.map((genre) => (
            <div key={genre.id} className="flex items-center gap-2">
              <Checkbox
                id={genre.id}
                checked={selectedGenres.includes(genre.id)}
                onCheckedChange={() => toggleGenre(genre.id)}
              />
              <label
                htmlFor={genre.id}
                className="text-sm cursor-pointer flex-1 flex justify-between"
              >
                <span>{genre.name}</span>
                <span className="text-muted-foreground">({genre.count})</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Trạng thái</Label>
        <RadioGroup value={status} onValueChange={setStatus}>
          {statusOptions.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem
                value={option.value}
                id={`status-${option.value}`}
              />
              <Label
                htmlFor={`status-${option.value}`}
                className="text-sm cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Apply Button */}
      <Button onClick={applyFilters} className="w-full">
        Áp dụng bộ lọc
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 p-6 rounded-xl bg-card border">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Bộ lọc
            </h2>
            <FilterContent />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
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
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={sort} onValueChange={setSort}>
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
          {selectedGenres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedGenres.map((genreId) => {
                const genre = genres.find((g) => g.id === genreId);
                return (
                  <Button
                    key={genreId}
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleGenre(genreId)}
                    className="gap-1"
                  >
                    {genre?.name}
                    <span className="ml-1">×</span>
                  </Button>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedGenres([])}
              >
                Xóa tất cả
              </Button>
            </div>
          )}

          {/* Stories Grid */}
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

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
