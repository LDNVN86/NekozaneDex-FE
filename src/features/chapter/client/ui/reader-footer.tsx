"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import type { Chapter } from "@/features/story";

interface ReaderFooterProps {
  storySlug: string;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
  /** Control visibility for auto-hide */
  isVisible?: boolean;
}

export function ReaderFooter({
  storySlug,
  prevChapter,
  nextChapter,
  isVisible = true,
}: ReaderFooterProps) {
  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 border-t py-4 bg-black/95 border-gray-800 backdrop-blur-sm",
        "transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {/* Previous Chapter */}
          <Button
            variant="outline"
            disabled={!prevChapter}
            asChild={!!prevChapter}
          >
            {prevChapter ? (
              <Link
                href={`/client/stories/${storySlug}/${prevChapter.chapter_number}`}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Chương trước</span>
                <span className="sm:hidden">Trước</span>
              </Link>
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Chương trước</span>
                <span className="sm:hidden">Trước</span>
              </>
            )}
          </Button>

          {/* Story Link */}
          <Button variant="ghost" asChild>
            <Link href={`/client/stories/${storySlug}`}>
              <List className="h-4 w-4 mr-2" />
              Mục lục
            </Link>
          </Button>

          {/* Next Chapter */}
          <Button
            variant="outline"
            disabled={!nextChapter}
            asChild={!!nextChapter}
          >
            {nextChapter ? (
              <Link
                href={`/client/stories/${storySlug}/${nextChapter.chapter_number}`}
              >
                <span className="hidden sm:inline">Chương sau</span>
                <span className="sm:hidden">Sau</span>
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            ) : (
              <>
                <span className="hidden sm:inline">Chương sau</span>
                <span className="sm:hidden">Sau</span>
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </footer>
  );
}
