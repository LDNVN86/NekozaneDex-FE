import { Skeleton } from "@/shared/ui/skeleton";
import { Card } from "@/shared/ui/card";
import { BookOpen } from "lucide-react";

export default function NewStoryLoading() {
  return (
    <div className="p-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-violet-500/20">
          <BookOpen className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <Skeleton className="h-7 w-48 mb-1" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Main Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cover Image Skeleton */}
        <div className="lg:col-span-3">
          <Card className="glass-card p-4 border-border/50 bg-card/50 backdrop-blur-sm">
            <Skeleton className="h-4 w-16 mb-3" />
            <Skeleton className="w-full aspect-[2/3] rounded-lg" />
          </Card>
        </div>

        {/* Center: Form Fields Skeleton */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="glass-card p-5 border-border/50 bg-card/50 backdrop-blur-sm">
            <Skeleton className="h-4 w-24 mb-4" />

            {/* Title */}
            <div className="space-y-4">
              <div>
                <Skeleton className="h-3 w-12 mb-1.5" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>

              {/* Description */}
              <div>
                <Skeleton className="h-3 w-16 mb-1.5" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>

              {/* Author + Translator */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Skeleton className="h-3 w-14 mb-1.5" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-3 w-18 mb-1.5" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>

              {/* Source URL */}
              <div>
                <Skeleton className="h-3 w-16 mb-1.5" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Settings Skeleton */}
        <div className="lg:col-span-3 space-y-4">
          {/* Genre */}
          <Card className="glass-card p-4 border-border/50 bg-card/50 backdrop-blur-sm">
            <Skeleton className="h-4 w-16 mb-3" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="flex flex-wrap gap-1.5 mt-3">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </Card>

          {/* Status */}
          <Card className="glass-card p-4 border-border/50 bg-card/50 backdrop-blur-sm">
            <Skeleton className="h-4 w-16 mb-3" />
            <Skeleton className="h-10 w-full rounded-lg mb-3" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </Card>

          {/* Action */}
          <Card className="glass-card p-4 border-border/50 bg-card/50 backdrop-blur-sm">
            <Skeleton className="h-10 w-full rounded-lg" />
          </Card>
        </div>
      </div>
    </div>
  );
}
