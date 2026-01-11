import { StoryCardSkeleton } from "./story-card-skeleton";

interface StoriesGridSkeletonProps {
  count?: number;
}

export function StoriesGridSkeleton({ count = 12 }: StoriesGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <StoryCardSkeleton key={i} />
      ))}
    </div>
  );
}
