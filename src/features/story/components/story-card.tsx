import Link from "next/link";
import { Eye, BookOpen } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";

interface StoryCardProps {
  id: string;
  title: string;
  slug: string;
  coverUrl?: string;
  chapterCount: number;
  viewCount: number;
  status?: "ongoing" | "completed";
  isHot?: boolean;
  className?: string;
}

export function StoryCard({
  title,
  slug,
  coverUrl,
  chapterCount,
  viewCount,
  status,
  isHot,
  className,
}: StoryCardProps) {
  return (
    <Link
      href={`/client/stories/${slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl bg-card border border-border transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1",
        className
      )}
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={
            coverUrl ||
            `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(
              title + " novel cover"
            )}`
          }
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

        {/* Status Badge */}
        {status && (
          <Badge
            variant={status === "completed" ? "default" : "secondary"}
            className="absolute top-2 left-2 text-xs"
          >
            {status === "completed" ? "Hoàn thành" : "Đang ra"}
          </Badge>
        )}

        {/* Hot Badge */}
        {isHot && (
          <Badge
            variant="destructive"
            className="absolute top-2 right-2 text-xs"
          >
            HOT
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-3">
        <h3 className="font-semibold text-sm line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {chapterCount} chương
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {viewCount.toLocaleString("vi-VN")}
          </span>
        </div>
      </div>
    </Link>
  );
}
