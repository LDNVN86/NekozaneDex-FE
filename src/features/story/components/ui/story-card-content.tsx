import { BookOpen, Eye } from "lucide-react";

export const StoryCardContent = ({
  title,
  chapterCount,
  viewCount,
}: {
  title: string;
  chapterCount: number;
  viewCount: number;
}) => {
  return (
    <div className="flex flex-col gap-2 p-3 min-h-[72px]">
      <h3
        className="font-semibold text-sm line-clamp-2 text-card-foreground group-hover:text-primary transition-colors leading-tight"
        title={title}
      >
        {title}
      </h3>
      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
        <span className="flex items-center gap-1">
          <BookOpen className="h-3 w-3 shrink-0" />
          <span className="truncate">{chapterCount} chương</span>
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3 shrink-0" />
          <span className="truncate">{viewCount.toLocaleString("vi-VN")}</span>
        </span>
      </div>
    </div>
  );
};
