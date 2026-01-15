"use client";

import * as React from "react";
import { toast } from "sonner";
import { toggleBookmarkAction } from "@/features/bookmarks/actions/bookmark-actions";
import type { Story, Chapter } from "@/features/story";
import { getChapterNumbers } from "./story-header-utils";

// Parts
import { StoryBackground } from "./story-header-parts/StoryBackground";
import { StoryCover } from "./story-header-parts/StoryCover";
import { StoryInfo } from "./story-header-parts/StoryInfo";
import { StorySynopsis } from "./story-header-parts/StorySynopsis";
import { StoryActions } from "./story-header-parts/StoryActions";

interface StoryHeaderProps {
  story: Story;
  chapters: Chapter[];
  newestChapterNumber?: number;
  initialBookmarked?: boolean;
}

export function StoryHeader({
  story,
  chapters,
  newestChapterNumber,
  initialBookmarked = false,
}: StoryHeaderProps) {
  const [isBookmarked, setIsBookmarked] = React.useState(initialBookmarked);
  const [isPending, startTransition] = React.useTransition();

  const handleBookmarkToggle = () => {
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);

    startTransition(async () => {
      const result = await toggleBookmarkAction(
        story.id,
        story.slug,
        previousState
      );
      if (!result.success) {
        setIsBookmarked(previousState);
        toast.error(result.error || "Không thể cập nhật bookmark");
      } else {
        toast.success(
          result.isBookmarked ? "Đã lưu truyện" : "Đã bỏ lưu truyện"
        );
      }
    });
  };

  const { oldestChapterNumber, newestChapterNum } = React.useMemo(
    () => getChapterNumbers(chapters, newestChapterNumber),
    [chapters, newestChapterNumber]
  );

  return (
    <div className="relative mb-10">
      <StoryBackground coverImageUrl={story.cover_image_url} />

      <div className="flex flex-col lg:flex-row gap-8">
        <StoryCover
          title={story.title}
          coverImageUrl={story.cover_image_url}
          status={story.status}
        />

        <div className="flex-1 flex flex-col gap-4">
          <StoryInfo story={story} />

          <StorySynopsis story={story} />

          <StoryActions
            storySlug={story.slug}
            oldestChapterNumber={oldestChapterNumber}
            newestChapterNum={newestChapterNum}
            hasChapters={chapters.length > 0}
            isBookmarked={isBookmarked}
            handleBookmarkToggle={handleBookmarkToggle}
            isPending={isPending}
          />
        </div>
      </div>
    </div>
  );
}
