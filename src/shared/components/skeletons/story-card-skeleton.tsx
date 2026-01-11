import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";

interface StoryCardSkeletonProps {
  className?: string;
}

export function StoryCardSkeleton({ className }: StoryCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl bg-card border",
        className
      )}
    >
      {/* Cover Image Skeleton */}
      <Skeleton className="aspect-[3/4] w-full rounded-none" />

      {/* Content Skeleton */}
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}
