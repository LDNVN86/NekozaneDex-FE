"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, List, Settings, Home } from "lucide-react";
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
import { ReaderSettings } from "./reader-settings";

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
}: ReaderHeaderProps) {
  const sortedChapters = [...chapters].sort(
    (a, b) => a.chapter_number - b.chapter_number
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-black/95 border-gray-800 backdrop-blur-sm">
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
              Chương {chapter.chapter_number}/{totalChapters}
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
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Danh sách chương</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-80px)] mt-4">
                  <div className="space-y-1 pr-4">
                    {sortedChapters.map((c) => (
                      <Link
                        key={c.id}
                        href={`/client/stories/${story.slug}/${c.chapter_number}`}
                        className={cn(
                          "block px-3 py-2 rounded-md text-sm transition-colors",
                          c.chapter_number === chapter.chapter_number
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                        Chương {c.chapter_number}: {c.title}
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {/* Settings */}
            <ReaderSettings zoom={zoom} onZoomChange={onZoomChange} />

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
