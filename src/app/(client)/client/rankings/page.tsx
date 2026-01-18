import { getHotStories } from "@/features/story";
import { getStoriesWithFilters } from "@/features/story/server/api";
import { createMetadata } from "@/shared/lib/seo";
import { RankingsHeader, RankingsTabs } from "@/features/rankings";

export const metadata = createMetadata({
  title: "Bảng Xếp Hạng",
  description: "Top truyện được yêu thích nhất trên Nekozanedex",
});

export default async function RankingsPage() {
  // Fetch rankings from backend with proper sorting
  const [byViewsRes, byRatingRes, hotRes] = await Promise.all([
    getStoriesWithFilters({ sort: "popular", limit: 20 }),
    getStoriesWithFilters({ sort: "rating", limit: 20 }),
    getHotStories(10),
  ]);

  const byViews = byViewsRes.success ? byViewsRes.data.data : [];
  const byRating = byRatingRes.success ? byRatingRes.data.data : [];
  const trending = hotRes.success ? hotRes.data : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <RankingsHeader />
      <RankingsTabs byViews={byViews} byRating={byRating} trending={trending} />
    </div>
  );
}
