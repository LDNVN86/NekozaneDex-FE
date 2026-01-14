import { getAuthFromCookie, hasRole } from "@/features/auth/server";
import { getStoryById, getAllGenres } from "@/features/admin/server";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { EditStoryPageClient } from "./edit-story-page-client";

interface EditStoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditStoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const storyResult = await getStoryById(id);

  if (!storyResult.success) {
    return { title: "Không tìm thấy truyện | Nekozanedex Admin" };
  }

  return {
    title: `Chỉnh sửa: ${storyResult.data.title} | Nekozanedex Admin`,
    description: `Chỉnh sửa thông tin truyện ${storyResult.data.title}`,
  };
}

export default async function EditStoryPage({ params }: EditStoryPageProps) {
  const { id } = await params;

  // Auth check
  const authResult = await getAuthFromCookie();
  if (!authResult.success || !hasRole(authResult.data, ["admin"])) {
    redirect("/auth/login");
  }

  // Fetch data
  const [storyResult, genresResult] = await Promise.all([
    getStoryById(id),
    getAllGenres(),
  ]);

  if (!storyResult.success) {
    notFound();
  }

  const genres = genresResult.success ? genresResult.data : [];

  return <EditStoryPageClient story={storyResult.data} genres={genres} />;
}
