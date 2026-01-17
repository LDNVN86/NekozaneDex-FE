"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { cn } from "@/shared/lib/utils";
import type { Chapter } from "@/features/story";

interface ReaderChapterListProps {
  storySlug: string;
  currentChapterNumber: number;
  initialChapters: Chapter[];
  totalChapters: number;
}

const CHAPTERS_PER_PAGE = 20;

/**
 * Chapter list with API pagination for reader sidebar.
 */
export function ReaderChapterList({
  storySlug,
  currentChapterNumber,
  initialChapters,
  totalChapters,
}: ReaderChapterListProps) {
  const [chapters, setChapters] = React.useState(initialChapters);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  const totalPages = Math.ceil(totalChapters / CHAPTERS_PER_PAGE);

  // Fetch chapters from API
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

  // Auto-navigate to page containing current chapter on mount
  React.useEffect(() => {
    const idx = initialChapters.findIndex(
      (c) => c.chapter_number === currentChapterNumber,
    );
    if (idx === -1 && totalChapters > CHAPTERS_PER_PAGE) {
      // Current chapter not in initial page, estimate which page it's on
      const estimatedPage = Math.ceil(currentChapterNumber / CHAPTERS_PER_PAGE);
      if (estimatedPage > 1 && estimatedPage <= totalPages) {
        setCurrentPage(estimatedPage);
        fetchChapters(estimatedPage);
      }
    }
  }, [
    currentChapterNumber,
    initialChapters,
    totalChapters,
    totalPages,
    fetchChapters,
  ]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || isLoading)
      return;
    setCurrentPage(page);
    fetchChapters(page);
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-3 space-y-1">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            chapters.map((c) => (
              <ChapterItem
                key={c.id}
                chapter={c}
                storySlug={storySlug}
                isActive={c.chapter_number === currentChapterNumber}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-3 border-t border-border/50">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="px-3 py-1.5 text-sm rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-50"
          >
            ← Trước
          </button>
          <span className="text-sm text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="px-3 py-1.5 text-sm rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-50"
          >
            Sau →
          </button>
        </div>
      )}
    </>
  );
}

// Sub-component for chapter item
function ChapterItem({
  chapter,
  storySlug,
  isActive,
}: {
  chapter: Chapter;
  storySlug: string;
  isActive: boolean;
}) {
  const label = chapter.chapter_label || `Chương ${chapter.chapter_number}`;
  const isSpecial = chapter.chapter_type && chapter.chapter_type !== "regular";

  return (
    <Link
      href={`/client/stories/${storySlug}/${chapter.chapter_number}`}
      className={cn(
        "flex items-start gap-3 p-3 rounded-xl transition-all",
        isActive
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          : "hover:bg-muted/50",
      )}
    >
      <div
        className={cn(
          "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold",
          isActive
            ? "bg-primary-foreground/20 text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {chapter.chapter_number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-medium text-sm",
              isActive && "text-primary-foreground",
            )}
          >
            {label}
          </span>
          {isSpecial && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full uppercase font-semibold bg-purple-500/20 text-purple-400">
              {chapter.chapter_type}
            </span>
          )}
        </div>
        <p
          className={cn(
            "text-xs truncate mt-0.5",
            isActive ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
        >
          {chapter.title}
        </p>
      </div>
    </Link>
  );
}
