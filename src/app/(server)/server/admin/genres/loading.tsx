import { Skeleton } from "@/shared/ui/skeleton";
import { BookOpen, Search } from "lucide-react";

function GenreCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/[0.08]">
      <div className="flex items-start justify-between mb-2">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-5 w-24 rounded-md mb-4" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

export default function GenresLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-950/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 ring-1 ring-emerald-500/20">
            <BookOpen className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <Skeleton className="h-9 w-40 mb-1" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10 rounded-2xl blur-xl" />
          <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <GenreCardSkeleton key={i} />
          ))}
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <Skeleton className="h-14 w-14 rounded-full" />
      </div>
    </div>
  );
}
