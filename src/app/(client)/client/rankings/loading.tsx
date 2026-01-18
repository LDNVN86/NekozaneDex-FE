import { Skeleton } from "@/shared/ui/skeleton";

export default function RankingsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="text-center mb-8">
        <Skeleton className="h-10 w-48 mx-auto mb-3" />
        <Skeleton className="h-5 w-72 mx-auto" />
      </div>

      {/* Tabs skeleton */}
      <div className="flex justify-center gap-2 mb-8">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>

      {/* Rankings list skeleton */}
      <div className="max-w-4xl mx-auto space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-xl bg-card border animate-pulse"
          >
            {/* Rank number */}
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            {/* Cover image */}
            <Skeleton className="w-16 h-24 rounded-lg shrink-0" />
            {/* Content */}
            <div className="flex-1 min-w-0">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            {/* Stats */}
            <Skeleton className="h-8 w-20 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
