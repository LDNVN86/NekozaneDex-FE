"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Heart, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface StoryActionsProps {
  storySlug: string;
  oldestChapterNumber: number;
  newestChapterNum?: number;
  hasChapters: boolean;
  isBookmarked: boolean;
  handleBookmarkToggle: () => void;
  isPending: boolean;
}

export function StoryActions({
  storySlug,
  oldestChapterNumber,
  newestChapterNum,
  hasChapters,
  isBookmarked,
  handleBookmarkToggle,
  isPending,
}: StoryActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-1">
      <Button size="default" className="bg-primary hover:bg-primary/90" asChild>
        <Link href={`/client/stories/${storySlug}/${oldestChapterNumber}`}>
          <BookOpen className="h-4 w-4 mr-1.5" />
          Đọc từ đầu
        </Link>
      </Button>

      {hasChapters && newestChapterNum && (
        <Button size="default" variant="outline" asChild>
          <Link href={`/client/stories/${storySlug}/${newestChapterNum}`}>
            Chương mới nhất
          </Link>
        </Button>
      )}

      <Button
        size="default"
        variant={isBookmarked ? "default" : "outline"}
        onClick={handleBookmarkToggle}
        disabled={isPending}
        className={cn(
          isBookmarked && "bg-pink-500 hover:bg-pink-600 border-pink-500",
        )}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
        ) : (
          <Heart
            className={cn("h-4 w-4 mr-1.5", isBookmarked && "fill-current")}
          />
        )}
        {isBookmarked ? "Đã lưu" : "Lưu truyện"}
      </Button>
    </div>
  );
}
