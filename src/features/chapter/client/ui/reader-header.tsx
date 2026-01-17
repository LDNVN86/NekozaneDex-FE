"use client";

import * as React from "react";
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
import { cn } from "@/shared/lib/utils";
import type { Story, Chapter } from "@/features/story";
import {
  ReaderSettings,
  type PageFitMode,
  type ReadingMode,
} from "./reader-settings";
import { ReaderChapterList } from "./reader-chapter-list";
import type { ColorFilter } from "../hooks";

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
  isVisible?: boolean;
  pageFit: PageFitMode;
  onPageFitChange: (mode: PageFitMode) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  readingMode: ReadingMode;
  onReadingModeChange: (mode: ReadingMode) => void;
  // Visual filter controls
  brightness: number;
  onBrightnessChange: (value: number) => void;
  colorFilter: ColorFilter;
  onColorFilterChange: (filter: ColorFilter) => void;
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
  brightness,
  onBrightnessChange,
  colorFilter,
  onColorFilterChange,
}: ReaderHeaderProps) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 border-b bg-black/95 border-gray-800 backdrop-blur-sm",
        "transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "-translate-y-full",
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
                    {totalChapters} chương
                  </p>
                </SheetHeader>
                <ReaderChapterList
                  storySlug={story.slug}
                  currentChapterNumber={chapter.chapter_number}
                  initialChapters={chapters}
                  totalChapters={totalChapters}
                />
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
              brightness={brightness}
              onBrightnessChange={onBrightnessChange}
              colorFilter={colorFilter}
              onColorFilterChange={onColorFilterChange}
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
