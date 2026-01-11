import { StoriesGridSkeleton } from "@/shared/components/skeletons";
import { Skeleton } from "@/shared/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col">
      {/* Hero Section Skeleton */}
      <section className="py-16 md:py-24 bg-linear-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-12 w-full max-w-md" />
            <Skeleton className="h-4 w-full max-w-lg" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Stories Section Skeleton */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-7 w-48" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
          <StoriesGridSkeleton count={6} />
        </div>
      </section>

      {/* Hot Stories Section Skeleton */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-7 w-32" />
            </div>
            <Skeleton className="h-9 w-36" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
