import { notFound } from "next/navigation";
import {
  getStoryBySlug,
  getChapterByNumber,
  getChaptersByStory,
} from "@/features/story";
import { getAuthFromCookie } from "@/features/auth/server";
import { getStoryProgress } from "@/features/reading-history/server";
import { ChapterReaderClient } from "@/features/chapter/client/chapter-reader-client";
import { createStoryMetadata, createNotFoundMetadata } from "@/shared/lib/seo";

interface Props {
  params: Promise<{ slug: string; chapter: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug, chapter } = await params;
  const chapterNum = parseInt(chapter, 10);

  const [storyResult, chapterResult] = await Promise.all([
    getStoryBySlug(slug),
    getChapterByNumber(slug, chapterNum),
  ]);

  if (!storyResult.success || !chapterResult.success) {
    return createNotFoundMetadata("chapter");
  }

  const story = storyResult.data;
  const chapterData = chapterResult.data;

  return createStoryMetadata(story.title, {
    chapterTitle: chapterData.title,
    chapterNumber: chapterNum,
    coverImage: story.cover_image_url,
  });
}

export default async function ChapterPage({ params }: Props) {
  const { slug, chapter } = await params;
  const chapterNum = parseInt(chapter, 10);

  if (isNaN(chapterNum) || chapterNum < 1) {
    notFound();
  }

  // Check auth for reading progress
  const authResult = await getAuthFromCookie();
  const isLoggedIn = authResult.success;

  // First batch: fetch story, chapter, and chapters list
  const [storyResult, chapterResult, chaptersResult] = await Promise.all([
    getStoryBySlug(slug),
    getChapterByNumber(slug, chapterNum),
    getChaptersByStory(slug),
  ]);

  if (!storyResult.success || !chapterResult.success) {
    notFound();
  }

  const story = storyResult.data;
  const currentChapter = chapterResult.data;
  const chaptersData = chaptersResult.success
    ? chaptersResult.data
    : { chapters: [], total: 0 };
  const chapters = chaptersData.chapters || [];

  // Second: fetch progress using actual story ID (not slug)
  let savedScrollPos: number | undefined;
  if (isLoggedIn) {
    try {
      const progressResult = await getStoryProgress(story.id);
      if (progressResult.success && progressResult.data) {
        // Only restore if same chapter
        if (progressResult.data.chapter_id === currentChapter.id) {
          savedScrollPos = progressResult.data.scroll_position;
        }
      }
    } catch {
      // Ignore errors - progress is optional
    }
  }

  return (
    <ChapterReaderClient
      story={story}
      chapter={currentChapter}
      chapters={chapters}
      savedScrollPosition={savedScrollPos}
    />
  );
}
