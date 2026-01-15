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
    <div className="flex flex-wrap items-center gap-3 mt-2">
      <Button
        size="lg"
        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        asChild
      >
        <Link href={`/client/stories/${storySlug}/${oldestChapterNumber}`}>
          <BookOpen className="h-5 w-5 mr-2" />
          Đọc từ đầu
        </Link>
      </Button>

      {hasChapters && newestChapterNum && (
        <Button size="lg" variant="outline" asChild>
          <Link href={`/client/stories/${storySlug}/${newestChapterNum}`}>
            Chương mới nhất
          </Link>
        </Button>
      )}

      <Button
        size="lg"
        variant={isBookmarked ? "default" : "outline"}
        onClick={handleBookmarkToggle}
        disabled={isPending}
        className={cn(
          isBookmarked &&
            "bg-pink-500 hover:bg-pink-600 border-pink-500 text-white"
        )}
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        ) : (
          <Heart
            className={cn("h-5 w-5 mr-2", isBookmarked && "fill-current")}
          />
        )}
        {isBookmarked ? "Đã lưu" : "Lưu truyện"}
      </Button>
    </div>
  );
}
