"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BookOpen,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { Chapter } from "@/features/story";

interface ChapterListProps {
  storySlug: string;
  chapters: Chapter[];
  totalChapters?: number;
}

const CHAPTERS_PER_PAGE = 10;

const CHAPTER_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  extra: {
    label: "Extra",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  bonus: {
    label: "Bonus",
    color: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  },
  omake: {
    label: "Omake",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
};

export function ChapterList({
  storySlug,
  chapters: initialChapters = [],
  totalChapters = 0,
}: ChapterListProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [chapters, setChapters] = React.useState<Chapter[]>(initialChapters);
  const [isLoading, setIsLoading] = React.useState(false);

  // Calculate total pages
  const chapterCount = totalChapters || initialChapters.length;
  const totalPages = Math.ceil(chapterCount / CHAPTERS_PER_PAGE);

  // Fetch chapters when page changes
  const fetchChapters = React.useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/stories/${storySlug}/chapters?page=${page}&limit=${CHAPTERS_PER_PAGE}`,
        );
        const data = await res.json();
        if (data.success && data.data?.chapters) {
          setChapters(data.data.chapters);
        }
      } catch (error) {
        console.error("Failed to fetch chapters:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [storySlug],
  );

  // Handle page change
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    fetchChapters(page);
  };

  // Generate visible page numbers (show 5 pages centered on current)
  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const isNewChapter = (dateString?: string) => {
    if (!dateString) return false;
    const publishDate = new Date(dateString);
    const now = new Date();
    const diffDays =
      (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  const getChapterLabel = (chapter: Chapter) => {
    if (chapter.chapter_label) return chapter.chapter_label;
    return `Ch.${chapter.chapter_number}`;
  };

  const visiblePages = getVisiblePages();

  // Skeleton component for loading
  const ChapterSkeleton = () => (
    <div className="divide-y divide-border/30">
      {Array.from({ length: CHAPTERS_PER_PAGE }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-3 h-10">
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-muted animate-pulse rounded" />
            <div className="h-3 w-32 bg-muted/60 animate-pulse rounded hidden md:block" />
          </div>
          <div className="h-3 w-10 bg-muted/40 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Chương
          <span className="text-muted-foreground font-normal text-sm">
            ({chapterCount})
          </span>
        </h2>
      </div>

      {/* Chapter List */}
      {chapterCount > 0 ? (
        <div className="border rounded-xl overflow-hidden bg-card/30">
          {/* Fixed height container = CHAPTERS_PER_PAGE * row height (40px) */}
          <div className="h-[400px] overflow-hidden">
            {isLoading ? (
              <ChapterSkeleton />
            ) : (
              <div className="divide-y divide-border/30">
                {chapters.map((chapter) => {
                  const typeConfig = chapter.chapter_type
                    ? CHAPTER_TYPE_CONFIG[chapter.chapter_type]
                    : null;
                  const isNew = isNewChapter(chapter.published_at);

                  return (
                    <Link
                      key={chapter.id}
                      href={`/client/stories/${storySlug}/${chapter.chapter_number}`}
                      className="flex items-center justify-between px-3 h-10 hover:bg-muted/40 transition-colors group"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                        <span className="font-medium text-sm text-primary group-hover:underline shrink-0">
                          {getChapterLabel(chapter)}
                        </span>
                        {typeConfig && (
                          <Badge
                            className={cn(
                              "text-[9px] px-1 py-0 h-4 border shrink-0",
                              typeConfig.color,
                            )}
                          >
                            {typeConfig.label}
                          </Badge>
                        )}
                        {isNew && (
                          <span className="flex items-center gap-0.5 text-[9px] text-emerald-400 font-medium shrink-0">
                            <Sparkles className="h-2.5 w-2.5" />
                            New
                          </span>
                        )}
                        {chapter.title && (
                          <span className="text-muted-foreground text-xs truncate hidden md:inline">
                            {chapter.title}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                        {formatDate(chapter.published_at || chapter.created_at)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 p-3 border-t border-border/30 bg-muted/20">
              {/* First Page */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              {/* Previous Page */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {visiblePages[0] > 1 && (
                  <span className="px-1 text-muted-foreground text-sm">
                    ...
                  </span>
                )}
                {visiblePages.map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "ghost"}
                    size="icon"
                    className={cn(
                      "h-8 w-8 text-sm",
                      page === currentPage &&
                        "bg-primary text-primary-foreground",
                    )}
                    onClick={() => goToPage(page)}
                    disabled={isLoading}
                  >
                    {page}
                  </Button>
                ))}
                {visiblePages[visiblePages.length - 1] < totalPages && (
                  <span className="px-1 text-muted-foreground text-sm">
                    ...
                  </span>
                )}
              </div>

              {/* Next Page */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Last Page */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages || isLoading}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-xl bg-card/30">
          <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">Chưa có chương</p>
        </div>
      )}
    </section>
  );
}
