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
  isListView?: boolean;
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
  isListView = false,
  className,
}: StoryCardProps) {
  if (isListView) {
    return (
      <Link
        href={`/client/stories/${slug}`}
        className={cn(
          "group flex flex-row items-center h-28 overflow-hidden rounded-xl bg-card border border-border transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50",
          className,
        )}
      >
        {/* Cover Image - Fixed width */}
        <div className="relative w-20 h-full shrink-0">
          <CoverImage
            url={coverUrl || ""}
            title={title}
            status={status}
            isHot={isHot}
          />
        </div>
        {/* Content */}
        <div className="flex-1 min-w-0">
          <StoryCardContent
            title={title}
            chapterCount={chapterCount}
            viewCount={viewCount}
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/client/stories/${slug}`}
      className={cn(
        "group/card relative flex flex-col h-full overflow-hidden rounded-xl bg-card border border-border transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1",
        className,
      )}
    >
      {/* Cover Image */}
      <div className="relative aspect-[2/3] w-full">
        <CoverImage
          url={coverUrl || ""}
          title={title}
          status={status}
          isHot={isHot}
        />
      </div>
      {/* Content */}
      <StoryCardContent
        title={title}
        chapterCount={chapterCount}
        viewCount={viewCount}
      />
    </Link>
  );
}
