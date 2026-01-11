import { redirect } from "next/navigation";
import { getChapterById, getStoryById } from "@/features/admin/server";
import { getAuthFromCookie } from "@/features/auth/server";
import { EditChapterPageClient } from "./edit-chapter-page-client";

interface EditChapterPageProps {
  params: Promise<{
    id: string;
    chapterId: string;
  }>;
}

export default async function EditChapterPage({
  params,
}: EditChapterPageProps) {
  const { id: storyId, chapterId } = await params;

  const authResult = await getAuthFromCookie();
  if (!authResult.success || authResult.data.role !== "admin") {
    redirect("/auth/login");
  }

  const [storyResult, chapterResult] = await Promise.all([
    getStoryById(storyId),
    getChapterById(chapterId),
  ]);

  if (!storyResult.success || !chapterResult.success) {
    redirect("/server/admin/stories");
  }

  return (
    <EditChapterPageClient
      story={storyResult.data}
      chapter={chapterResult.data}
    />
  );
}
