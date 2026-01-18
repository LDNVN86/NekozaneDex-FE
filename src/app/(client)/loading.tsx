import { Skeleton } from "@/shared/ui/skeleton";

function CarouselSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
          <Skeleton className="aspect-[2/3] w-full rounded-xl" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-3 w-2/3 mt-1" />
        </div>
      ))}
    </div>
  );
}

export default function HomeLoading() {
  return (
    <div className="flex flex-col">
      {/* Hero Section Skeleton */}
      <section className="py-16 md:py-24 bg-linear-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <Skeleton className="h-6 w-48 rounded-full" />
            <Skeleton className="h-12 w-full max-w-md" />
            <Skeleton className="h-4 w-full max-w-lg" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32 rounded-lg" />
              <Skeleton className="h-12 w-40 rounded-lg" />
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
          <CarouselSkeleton count={8} />
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
          <CarouselSkeleton count={8} />
        </div>
      </section>

      {/* Genres Section Skeleton */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
