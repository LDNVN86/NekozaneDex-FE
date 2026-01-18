"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  SortAsc,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { StoryCard } from "@/features/story/components/story-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import type { Story, Genre } from "@/features/story/interface/story-interface";

const sortOptions = [
  { value: "latest", label: "Mới cập nhật" },
  { value: "popular", label: "Lượt xem" },
  { value: "name", label: "Tên A-Z" },
  { value: "rating", label: "Đánh giá" },
];

interface GenreContentProps {
  genre: Genre;
  stories: Story[];
  totalPages: number;
  currentPage: number;
  total: number;
  initialSort: string;
}

function getPageNumbers(currentPage: number, totalPages: number): number[] {
  const pages: number[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage <= 3) {
    for (let i = 1; i <= maxVisible; i++) pages.push(i);
  } else if (currentPage >= totalPages - 2) {
    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
  } else {
    for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
  }

  return pages;
}

export function GenreContent({
  genre,
  stories,
  totalPages,
  currentPage,
  total,
  initialSort,
}: GenreContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = React.useState(initialSort);

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const navigateWithParams = (overrides: { page?: number; sort?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (overrides.page !== undefined) {
      if (overrides.page === 1) {
        params.delete("page");
      } else {
        params.set("page", String(overrides.page));
      }
    }
    if (overrides.sort !== undefined) {
      if (overrides.sort === "latest") {
        params.delete("sort");
      } else {
        params.set("sort", overrides.sort);
      }
    }
    const queryString = params.toString();
    router.push(
      `/client/genres/${genre.slug}${queryString ? `?${queryString}` : ""}`,
    );
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    navigateWithParams({ sort: value, page: 1 });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/client/genres">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tất cả thể loại
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-primary/10 text-primary">
              <BookOpen className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{genre.name}</h1>
              <p className="text-muted-foreground mt-1">
                {(total ?? 0).toLocaleString("vi-VN")} truyện
              </p>
            </div>
          </div>

          {/* Sort Dropdown */}
          <Select value={sort} onValueChange={handleSortChange}>
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
        </div>
      </div>

      {/* Stories grid */}
      {stories.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {stories.map((story, index) => (
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
                  status={story.status === "paused" ? "ongoing" : story.status}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => navigateWithParams({ page: currentPage - 1 })}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {pageNumbers.map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="icon"
                  onClick={() => navigateWithParams({ page: pageNum })}
                >
                  {pageNum}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => navigateWithParams({ page: currentPage + 1 })}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-lg font-medium">Chưa có truyện nào</p>
          <p className="text-muted-foreground">
            Thể loại này chưa có truyện nào
          </p>
        </div>
      )}
    </div>
  );
}
