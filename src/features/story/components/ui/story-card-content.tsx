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
  );
};
