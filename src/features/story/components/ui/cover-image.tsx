import { Badge } from "@/shared/ui/badge";

export const CoverImage = ({
  url,
  title,
  status,
  isHot,
}: {
  url: string;
  title: string;
  status?: string;
  isHot?: boolean;
}) => {
  return (
    <div className="relative aspect-3/4 overflow-hidden bg-muted h-full">
      <img
        src={
          url ||
          `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(
            title + " novel cover",
          )}`
        }
        alt={title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
      />
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent" />

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
        <Badge variant="destructive" className="absolute top-2 right-2 text-xs">
          HOT
        </Badge>
      )}
    </div>
  );
};
