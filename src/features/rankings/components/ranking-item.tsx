import Link from "next/link";
import { Eye, BookOpen, Medal } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { Story } from "@/features/story/interface/story-interface";

const RANK_COLORS = [
  "text-yellow-500",
  "text-gray-400",
  "text-amber-600",
] as const;

interface RankingItemProps {
  story: Story;
  rank: number;
}

export function RankingItem({ story, rank }: RankingItemProps) {
  const isTopThree = rank <= 3;
  const rankIndex = rank - 1;

  return (
    <Link
      href={`/client/stories/${story.slug}`}
      className="flex items-center gap-4 p-4 rounded-xl bg-card border hover:border-primary hover:shadow-lg transition-all duration-200"
    >
      {/* Rank Badge */}
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg shrink-0",
          isTopThree ? "bg-primary/10" : "bg-muted",
          isTopThree ? RANK_COLORS[rankIndex] : "text-muted-foreground"
        )}
      >
        {isTopThree ? <Medal className="h-5 w-5" /> : rank}
      </div>

      {/* Cover Image */}
      <img
        src={story.cover_image_url || "/placeholder.svg"}
        alt={story.title}
        className="w-14 h-20 object-cover rounded-lg shrink-0"
      />

      {/* Story Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">
          {story.title}
        </h3>
        <p className="text-sm text-muted-foreground">{story.author_name}</p>
        <div className="flex items-center gap-4 mt-1">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-3 w-3" />
            {story.view_count.toLocaleString("vi-VN")}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            {story.total_chapters} chương
          </span>
        </div>
      </div>

      {/* Status Badge - Hidden on mobile */}
      <Badge
        variant={story.status === "completed" ? "default" : "secondary"}
        className="shrink-0 hidden sm:flex"
      >
        {story.status === "completed" ? "Hoàn thành" : "Đang ra"}
      </Badge>
    </Link>
  );
}
