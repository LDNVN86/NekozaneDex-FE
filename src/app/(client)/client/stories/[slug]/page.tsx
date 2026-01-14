import { notFound } from "next/navigation";
import { getStoryBySlug, getChaptersByStory } from "@/features/story";
import { StoryDetailClient } from "@/features/story/client/story-detail-client";
import { createStoryMetadata, createNotFoundMetadata } from "@/shared/lib/seo";
import { stripHtml } from "@/shared/lib/html-utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const result = await getStoryBySlug(slug);

  if (!result.success) {
    return createNotFoundMetadata("story");
  }

  const story = result.data;
  return createStoryMetadata(story.title, {
    description: stripHtml(story.description || ""),
    coverImage: story.cover_image_url,
  });
}

export default async function StoryDetailPage({ params }: Props) {
  const { slug } = await params;

  const [storyResult, chaptersResult] = await Promise.all([
    getStoryBySlug(slug),
    getChaptersByStory(slug),
  ]);

  if (!storyResult.success) {
    notFound();
  }

  const story = storyResult.data;
  const chapters = chaptersResult.success ? chaptersResult.data : [];

  return <StoryDetailClient story={story} chapters={chapters} />;
}
