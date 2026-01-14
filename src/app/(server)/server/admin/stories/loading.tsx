import { Skeleton } from "@/shared/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

export default function StoriesLoading() {
  return (
    <>
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Card skeleton */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          {/* Table skeleton */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b">
                <Skeleton className="w-9 h-12 rounded" />
                <Skeleton className="h-5 w-48 flex-1" />
                <Skeleton className="h-5 w-24 hidden sm:block" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-5 w-16 hidden md:block" />
                <Skeleton className="h-5 w-20 hidden lg:block" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
