import { notFound } from "next/navigation";
import { getStoryBySlug, getChaptersByStory } from "@/features/story";
import { StoryDetailClient } from "../../../../features/story/client/story-detail-client";
interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const result = await getStoryBySlug(slug);

  if (!result.success) {
    return {
      title: "Truyện không tồn tại | Nekozanedex",
      description: "Truyện bạn tìm kiếm không tồn tại hoặc đã bị xóa.",
    };
  }

  const story = result.data;
  return {
    title: `${story.title} | Nekozanedex`,
    description:
      story.description || `Đọc truyện ${story.title} tại Nekozanedex`,
    openGraph: {
      title: story.title,
      description: story.description,
      images: story.cover_image_url ? [story.cover_image_url] : [],
    },
  };
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
