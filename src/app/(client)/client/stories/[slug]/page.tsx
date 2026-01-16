import { notFound } from "next/navigation";
import { getStoryBySlug, getChaptersByStory } from "@/features/story";
import { StoryDetailClient } from "@/features/story/client/story-detail-client";
import { createStoryMetadata, createNotFoundMetadata } from "@/shared/lib/seo";
import { stripHtml } from "@/shared/lib/html-utils";
import { checkBookmark } from "@/features/bookmarks/server";
import { getStoryComments } from "@/features/comments/server";
import { getAuthFromCookie } from "@/features/auth/server";

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

  // Fetch story and chapters
  const [storyResult, chaptersResult] = await Promise.all([
    getStoryBySlug(slug),
    getChaptersByStory(slug),
  ]);

  if (!storyResult.success) {
    notFound();
  }

  const story = storyResult.data;
  const chaptersData = chaptersResult.success
    ? chaptersResult.data
    : { chapters: [], total: 0 };

  // Fetch additional data: bookmark status, comments, auth
  const [bookmarkResult, commentsResult, authResult] = await Promise.all([
    checkBookmark(story.id),
    getStoryComments(story.id, 1, 10),
    getAuthFromCookie(),
  ]);

  const isBookmarked = bookmarkResult.success ? bookmarkResult.data : false;
  const commentsData = commentsResult.success
    ? commentsResult.data
    : { data: [], meta: { total: 0, total_pages: 1 } };
  const user = authResult.success ? authResult.data : null;

  return (
    <StoryDetailClient
      story={story}
      chapters={chaptersData.chapters}
      totalChapters={chaptersData.total}
      initialBookmarked={isBookmarked}
      comments={commentsData.data}
      totalComments={commentsData.meta.total}
      totalCommentPages={commentsData.meta.total_pages}
      currentUserId={user?.id}
      isAdmin={user?.role === "admin"}
    />
  );
}
