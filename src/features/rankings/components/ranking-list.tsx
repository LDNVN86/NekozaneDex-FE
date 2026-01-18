import type { Story } from "@/features/story/interface/story-interface";
import { RankingItem } from "./ranking-item";

interface RankingListProps {
  stories: Story[];
  showRating?: boolean;
}

export function RankingList({ stories, showRating = false }: RankingListProps) {
  if (stories.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Không có truyện nào trong danh sách này
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stories.map((story, index) => (
        <div
          key={story.id}
          className="animate-in fade-in slide-in-from-left-4 duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <RankingItem story={story} rank={index + 1} showRating={showRating} />
        </div>
      ))}
    </div>
  );
}
