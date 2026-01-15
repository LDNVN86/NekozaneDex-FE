"use client";

import * as React from "react";
import type { Story, Chapter } from "@/features/story";
import type { Comment } from "@/features/comments/server";
import { StoryHeader, ChapterList, CommentSection } from "./ui";

interface StoryDetailClientProps {
  story: Story;
  chapters: Chapter[];
  initialBookmarked?: boolean;
  comments?: Comment[];
  currentUserId?: string;
  isAdmin?: boolean;
}

export function StoryDetailClient({
  story,
  chapters,
  initialBookmarked = false,
  comments = [],
  currentUserId,
  isAdmin = false,
}: StoryDetailClientProps) {
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
        initialBookmarked={initialBookmarked}
      />
      <ChapterList storySlug={story.slug} chapters={chapters} />
      <CommentSection
        storyId={story.id}
        storySlug={story.slug}
        comments={comments}
        currentUserId={currentUserId}
        isAdmin={isAdmin}
      />
    </div>
  );
}
