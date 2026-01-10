"use client";

import * as React from "react";
import type { Story, Chapter } from "@/features/story";
import { StoryHeader, ChapterList, CommentSection } from "./ui";

interface StoryDetailClientProps {
  story: Story;
  chapters: Chapter[];
}

export function StoryDetailClient({ story, chapters }: StoryDetailClientProps) {
  const newestChapterNumber = React.useMemo(() => {
    if (chapters.length === 0) return undefined;
    return Math.max(...chapters.map((c) => c.chapter_number));
  }, [chapters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <StoryHeader
        story={story}
        chapters={chapters}
        newestChapterNumber={newestChapterNumber}
      />
      <ChapterList storySlug={story.slug} chapters={chapters} />
      <CommentSection />
    </div>
  );
}
