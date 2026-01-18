import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getGenres } from "@/features/search/server";
import { getStoriesWithFilters } from "@/features/story/server/api";
import { GenreContent } from "./genre-content";

interface GenrePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

// Generate metadata
export async function generateMetadata({
  params,
}: GenrePageProps): Promise<Metadata> {
  const { slug } = await params;
  const genresRes = await getGenres();
  const genres = genresRes.success ? genresRes.data : [];
  const genre = genres.find((g) => g.slug === slug);

  if (!genre) {
    return { title: "Thể loại không tồn tại" };
  }

  return {
    title: `Truyện ${genre.name}`,
    description: `Đọc truyện thể loại ${genre.name} hay nhất`,
  };
}

export default async function GenreDetailPage({
  params,
  searchParams,
}: GenrePageProps) {
  const { slug } = await params;
  const { page, sort } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const currentSort = sort || "latest";

  // Get genre info
  const genresRes = await getGenres();
  const genres = genresRes.success ? genresRes.data : [];
  const genre = genres.find((g) => g.slug === slug);

  if (!genre) {
    notFound();
  }

  // Get stories using the unified search API with genre and sort filters
  const storiesRes = await getStoriesWithFilters({
    genres: [slug],
    sort: currentSort,
    page: currentPage,
    limit: 24,
  });

  const stories = storiesRes.success ? storiesRes.data.data : [];
  const totalPages = storiesRes.success ? storiesRes.data.total_pages : 1;
  const total = storiesRes.success ? storiesRes.data.total : 0;

  return (
    <GenreContent
      genre={genre}
      stories={stories}
      totalPages={totalPages}
      currentPage={currentPage}
      total={total}
      initialSort={currentSort}
    />
  );
}
