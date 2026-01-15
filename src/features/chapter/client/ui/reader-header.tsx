"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, List, Home } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { cn } from "@/shared/lib/utils";
import type { Story, Chapter } from "@/features/story";
import {
  ReaderSettings,
  type PageFitMode,
  type ReadingMode,
} from "./reader-settings";

interface ReaderHeaderProps {
  story: Story;
  chapter: Chapter;
  chapters: Chapter[];
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
  totalChapters: number;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onNavigate: (chapterNumber: number) => void;
  /** Control visibility for auto-hide */
  isVisible?: boolean;
  /** Page fit mode */
  pageFit: PageFitMode;
  onPageFitChange: (mode: PageFitMode) => void;
  /** Fullscreen controls */
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  /** Reading mode */
  readingMode: ReadingMode;
  onReadingModeChange: (mode: ReadingMode) => void;
}

export function ReaderHeader({
  story,
  chapter,
  chapters,
  prevChapter,
  nextChapter,
  totalChapters,
  zoom,
  onZoomChange,
  onNavigate,
  isVisible = true,
  pageFit,
  onPageFitChange,
  isFullscreen,
  onToggleFullscreen,
  readingMode,
  onReadingModeChange,
}: ReaderHeaderProps) {
  // Sort by ordering (if set) or chapter_number
  const sortedChapters = [...chapters].sort((a, b) => {
    const orderA = a.ordering ?? a.chapter_number;
    const orderB = b.ordering ?? b.chapter_number;
    return orderA - orderB;
  });

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 border-b bg-black/95 border-gray-800 backdrop-blur-sm",
        "transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left - Back & Story Title */}
          <div className="flex items-center gap-2 min-w-0">
            <Button variant="ghost" size="icon" asChild className="shrink-0">
              <Link href={`/client/stories/${story.slug}`}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Link
              href={`/client/stories/${story.slug}`}
              className="font-medium truncate hover:text-primary transition-colors text-sm max-w-[120px] sm:max-w-[200px]"
            >
              {story.title}
            </Link>
          </div>

          {/* Center - Chapter Navigation */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              disabled={!prevChapter}
              onClick={() =>
                prevChapter && onNavigate(prevChapter.chapter_number)
              }
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium px-2 whitespace-nowrap">
              {chapter.chapter_label || `Chương ${chapter.chapter_number}`}/
              {totalChapters}
            </span>
            <Button
              variant="ghost"
              size="icon"
              disabled={!nextChapter}
              onClick={() =>
                nextChapter && onNavigate(nextChapter.chapter_number)
              }
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Right - Tools */}
          <div className="flex items-center gap-1">
            {/* Chapter List Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <List className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0">
                <SheetHeader className="p-4 border-b border-border/50">
                  <SheetTitle className="text-lg">Danh sách chương</SheetTitle>
                  <p className="text-sm text-muted-foreground">
                    {chapters.length} chương
                  </p>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-100px)]">
                  <div className="p-3 space-y-1">
                    {sortedChapters.map((c) => {
                      const isActive =
                        c.chapter_number === chapter.chapter_number;
                      const chapterLabel =
                        c.chapter_label || `Chương ${c.chapter_number}`;
                      const isSpecialType =
                        c.chapter_type && c.chapter_type !== "regular";

                      return (
                        <Link
                          key={c.id}
                          href={`/client/stories/${story.slug}/${c.chapter_number}`}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-xl transition-all",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                              : "hover:bg-muted/50"
                          )}
                        >
                          {/* Chapter Number Badge */}
                          <div
                            className={cn(
                              "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold",
                              isActive
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {c.chapter_number}
                          </div>

                          {/* Chapter Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "font-medium text-sm",
                                  isActive
                                    ? "text-primary-foreground"
                                    : "text-foreground"
                                )}
                              >
                                {chapterLabel}
                              </span>
                              {isSpecialType && (
                                <span
                                  className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-full uppercase font-semibold",
                                    c.chapter_type === "extra" &&
                                      "bg-purple-500/20 text-purple-400",
                                    c.chapter_type === "bonus" &&
                                      "bg-pink-500/20 text-pink-400",
                                    c.chapter_type === "omake" &&
                                      "bg-amber-500/20 text-amber-400"
                                  )}
                                >
                                  {c.chapter_type}
                                </span>
                              )}
                            </div>
                            <p
                              className={cn(
                                "text-xs truncate mt-0.5",
                                isActive
                                  ? "text-primary-foreground/80"
                                  : "text-muted-foreground"
                              )}
                            >
                              {c.title}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {/* Settings */}
            <ReaderSettings
              zoom={zoom}
              onZoomChange={onZoomChange}
              pageFit={pageFit}
              onPageFitChange={onPageFitChange}
              isFullscreen={isFullscreen}
              onToggleFullscreen={onToggleFullscreen}
              readingMode={readingMode}
              onReadingModeChange={onReadingModeChange}
            />

            {/* Home */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
