import { Suspense } from "react";
import { getStories } from "@/features/story";
import { getGenres } from "@/features/search/server";
import { createMetadata } from "@/shared/lib/seo";
import { StoriesContent } from "@/features/story/components/stories-page/stories-content";

export const metadata = createMetadata({
  title: "Danh Sách Truyện",
  description: "Khám phá hàng ngàn bộ truyện chất lượng cao",
});

interface StoriesPageProps {
  searchParams: Promise<{
    genre?: string;
    status?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  const [storiesRes, genresRes] = await Promise.all([
    getStories(page, 20),
    getGenres(),
  ]);

  const stories = storiesRes.success ? storiesRes.data.data : [];
  const totalPages = storiesRes.success ? storiesRes.data.total_pages : 0;
  const total = storiesRes.success ? storiesRes.data.total : 0;
  const genres = genresRes.success ? genresRes.data : [];

  return (
    <Suspense
      fallback={<div className="container mx-auto px-4 py-8">Đang tải...</div>}
    >
      <StoriesContent
        initialStories={stories}
        genres={genres}
        totalPages={totalPages}
        currentPage={page}
        total={total}
        initialGenres={params.genre?.split(",").filter(Boolean) || []}
        initialStatus={params.status || "all"}
        initialSort={params.sort || "latest"}
      />
    </Suspense>
  );
}
