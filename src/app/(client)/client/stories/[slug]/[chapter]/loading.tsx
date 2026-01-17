import { Skeleton } from "@/shared/ui/skeleton";

export default function ChapterLoading() {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <Skeleton className="h-full w-1/3 bg-primary/50" />
      </div>

      {/* Header skeleton */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b bg-black/95 border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </div>
      </header>

      {/* Content skeleton - manga pages */}
      <div className="pt-16 pb-20 container mx-auto flex flex-col items-center gap-2">
        <Skeleton className="h-6 w-48 mb-4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full max-w-4xl aspect-[3/4] rounded-lg bg-muted/30"
          />
        ))}
      </div>

      {/* Footer skeleton */}
      <footer className="fixed bottom-0 left-0 right-0 border-t py-4 bg-black/95 border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <Skeleton className="h-10 w-28 rounded" />
            <Skeleton className="h-10 w-20 rounded" />
            <Skeleton className="h-10 w-28 rounded" />
          </div>
        </div>
      </footer>
    </div>
  );
}
