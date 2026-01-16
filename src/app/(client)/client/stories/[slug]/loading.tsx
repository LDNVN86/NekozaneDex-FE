import { Skeleton } from "@/shared/ui/skeleton";

export default function StoryDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <Skeleton className="w-48 h-72 rounded-xl shrink-0" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chapters */}
        <div className="lg:col-span-2 space-y-2">
          <Skeleton className="h-6 w-32 mb-4" />
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        {/* Sidebar */}
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
