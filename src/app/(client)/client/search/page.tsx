import { Suspense } from "react";
import { SearchContent } from "@/features/search/components/search-content";
import { searchStories, getGenres } from "@/features/search/server";
import { createSearchMetadata } from "@/shared/lib/seo";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    genres?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  return createSearchMetadata(params.q);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const genresParam = params.genres?.split(",").filter(Boolean) || [];
  const page = parseInt(params.page || "1", 10);

  const [storiesResult, genresResult] = await Promise.all([
    searchStories({
      q: query,
      genres: genresParam,
      page,
      limit: 24,
    }),
    getGenres(),
  ]);

  const stories = storiesResult.success ? storiesResult.data.data : [];
  const totalPages = storiesResult.success ? storiesResult.data.total_pages : 0;
  const total = storiesResult.success ? storiesResult.data.total : 0;
  const genres = genresResult.success ? genresResult.data : [];

  return (
    <Suspense
      fallback={<div className="container mx-auto px-4 py-8">Đang tải...</div>}
    >
      <SearchContent
        initialStories={stories}
        genres={genres}
        totalPages={totalPages}
        currentPage={page}
        total={total}
        initialQuery={query}
        initialGenres={genresParam}
      />
    </Suspense>
  );
}
