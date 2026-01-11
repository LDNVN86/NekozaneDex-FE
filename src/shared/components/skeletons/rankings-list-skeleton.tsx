import { RankingItemSkeleton } from "./ranking-item-skeleton";

interface RankingsListSkeletonProps {
  count?: number;
}

export function RankingsListSkeleton({
  count = 10,
}: RankingsListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <RankingItemSkeleton key={i} />
      ))}
    </div>
  );
}
