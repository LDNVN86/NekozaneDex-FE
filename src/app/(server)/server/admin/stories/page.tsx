import { getAuthFromCookie, hasRole } from "@/features/auth/server";
import { getAdminStories, getAllGenres } from "@/features/admin/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { StoriesPageClient } from "./stories-page-client";

export const metadata: Metadata = {
  title: "Quản lý truyện | Nekozanedex Admin",
  description: "Danh sách và quản lý truyện",
};

interface StoriesPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  // Auth check
  const authResult = await getAuthFromCookie();
  if (!authResult.success || !hasRole(authResult.data, ["admin"])) {
    redirect("/auth/login");
  }

  // Get params from searchParams
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const search = params.search || "";

  // Fetch data with search
  const [storiesResult, genresResult] = await Promise.all([
    getAdminStories(page, 20, search),
    getAllGenres(),
  ]);

  const stories = storiesResult.success
    ? storiesResult.data
    : { data: [], total: 0, page: 1, limit: 20, total_pages: 0 };

  const genres = genresResult.success ? genresResult.data : [];

  return (
    <StoriesPageClient
      stories={stories.data}
      genres={genres}
      pagination={{
        page: stories.page,
        totalPages: stories.total_pages,
        total: stories.total,
      }}
      initialSearch={search}
    />
  );
}
