import { getAuthFromCookie, hasRole } from "@/features/auth/server";
import { getStoryById, getChaptersByStoryId } from "@/features/admin/server";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChaptersPageClient } from "./chapters-page-client";

interface ChaptersPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ChaptersPageProps): Promise<Metadata> {
  const { id } = await params;
  const storyResult = await getStoryById(id);

  if (!storyResult.success) {
    return { title: "Không tìm thấy truyện | Nekozanedex Admin" };
  }

  return {
    title: `Chapters: ${storyResult.data.title} | Nekozanedex Admin`,
    description: `Quản lý chapters của ${storyResult.data.title}`,
  };
}

export default async function ChaptersPage({ params }: ChaptersPageProps) {
  const { id } = await params;

  // Auth check
  const authResult = await getAuthFromCookie();
  if (!authResult.success || !hasRole(authResult.data, ["admin"])) {
    redirect("/auth/login");
  }

  // Fetch story and chapters in parallel
  const [storyResult, chaptersResult] = await Promise.all([
    getStoryById(id),
    getChaptersByStoryId(id),
  ]);

  if (!storyResult.success) {
    notFound();
  }

  const chapters = chaptersResult.success ? chaptersResult.data : [];

  return <ChaptersPageClient story={storyResult.data} chapters={chapters} />;
}
