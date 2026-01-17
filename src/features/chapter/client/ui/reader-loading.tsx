"use client";

import { Skeleton } from "@/shared/ui/skeleton";

/**
 * Loading skeleton shown while reader settings load from localStorage.
 * Prevents flicker by matching the dark reader UI.
 */
export function ReaderLoading() {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 border-b bg-black/95 border-gray-800">
        <div className="container mx-auto px-4 flex items-center justify-between h-full">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </header>

      {/* Content placeholder */}
      <div className="pt-16 pb-20 container mx-auto flex flex-col items-center gap-2">
        <Skeleton className="w-full max-w-4xl aspect-[3/4] rounded-lg bg-muted/30" />
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 h-16 border-t bg-black/95 border-gray-800" />
    </div>
  );
}
