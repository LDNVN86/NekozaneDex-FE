import * as React from "react";

interface CommentSkeletonProps {
  count?: number;
}

export function CommentSkeleton({ count = 10 }: CommentSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex gap-3 p-4 bg-card/50 rounded-lg animate-pulse"
        >
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-3 w-full bg-muted/60 rounded" />
            <div className="h-3 w-3/4 bg-muted/40 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
