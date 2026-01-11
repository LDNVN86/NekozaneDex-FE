import { notFound } from "next/navigation";
import {
  getStoryBySlug,
  getChapterByNumber,
  getChaptersByStory,
} from "@/features/story";
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
  const chapters = chaptersResult.success ? chaptersResult.data : [];

  return (
    <ChapterReaderClient
      story={story}
      chapter={currentChapter}
      chapters={chapters}
    />
  );
}
