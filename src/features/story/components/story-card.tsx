import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { CoverImage } from "./ui/cover-image";
import { StoryCardContent } from "./ui/story-card-content";

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
      <CoverImage
        url={coverUrl || ""}
        title={title}
        status={status}
        isHot={isHot}
      />
      {/* Content */}
      <StoryCardContent
        title={title}
        chapterCount={chapterCount}
        viewCount={viewCount}
      />
    </Link>
  );
}
