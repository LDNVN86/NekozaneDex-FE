import { getHotStories, getStories } from "@/features/story";
import { createMetadata } from "@/shared/lib/seo";
import { RankingsHeader, RankingsTabs } from "@/features/rankings";

export const metadata = createMetadata({
  title: "Bảng Xếp Hạng",
  description: "Top truyện được yêu thích nhất trên Nekozanedex",
});

export default async function RankingsPage() {
  const [storiesRes, hotRes] = await Promise.all([
    getStories(1, 20),
    getHotStories(10),
  ]);

  const allStories = storiesRes.success ? storiesRes.data.data : [];
  const hotStories = hotRes.success ? hotRes.data : [];

  // Pre-sort stories on server for better performance
  const byViews = [...allStories].sort((a, b) => b.view_count - a.view_count);
  const byChapters = [...allStories].sort(
    (a, b) => b.total_chapters - a.total_chapters
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <RankingsHeader />
      <RankingsTabs
        byViews={byViews}
        byChapters={byChapters}
        trending={hotStories}
      />
    </div>
  );
}
