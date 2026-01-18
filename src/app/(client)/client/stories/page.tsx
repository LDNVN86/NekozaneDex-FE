import { Suspense } from "react";
import { getStoriesWithFilters, searchStories } from "@/features/story";
import { getGenres } from "@/features/search/server";
import { createMetadata, createSearchMetadata } from "@/shared/lib/seo";
import { StoriesContent } from "@/features/story/components/stories-page/stories-content";

interface StoriesPageProps {
  searchParams: Promise<{
    q?: string;
    genre?: string;
    status?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: StoriesPageProps) {
  const params = await searchParams;
  if (params.q) {
    return createSearchMetadata(params.q);
  }
  return createMetadata({
    title: "Danh Sách Truyện",
    description: "Khám phá hàng ngàn bộ truyện chất lượng cao",
  });
}

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const page = parseInt(params.page || "1", 10);
  const genres = params.genre?.split(",").filter(Boolean) || [];
  const status = params.status || "all";
  const sort = params.sort || "latest";

  // If there's a search query, use search API
  const hasQuery = query.length > 0;

  const [storiesRes, genresRes] = await Promise.all([
    hasQuery
      ? searchStories(query, page, 20)
      : getStoriesWithFilters({
          genres: genres.length > 0 ? genres : undefined,
          status: status !== "all" ? status : undefined,
          sort: sort !== "latest" ? sort : undefined,
          page,
          limit: 20,
        }),
    getGenres(),
  ]);

  const stories = storiesRes.success ? storiesRes.data.data : [];
  const totalPages = storiesRes.success ? storiesRes.data.total_pages : 0;
  const total = storiesRes.success ? storiesRes.data.total : 0;
  const allGenres = genresRes.success ? genresRes.data : [];

  return (
    <Suspense
      fallback={<div className="container mx-auto px-4 py-8">Đang tải...</div>}
    >
      <StoriesContent
        initialStories={stories}
        genres={allGenres}
        totalPages={totalPages}
        currentPage={page}
        total={total}
        initialQuery={query}
        initialGenres={genres}
        initialStatus={status}
        initialSort={sort}
      />
    </Suspense>
  );
}
