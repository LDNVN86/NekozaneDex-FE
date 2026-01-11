import { Skeleton } from "@/shared/ui/skeleton";

export function RankingItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border">
      {/* Rank Badge */}
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />

      {/* Cover Image */}
      <Skeleton className="w-14 h-20 rounded-lg shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Badge */}
      <Skeleton className="h-6 w-20 hidden sm:block shrink-0" />
    </div>
  );
}
