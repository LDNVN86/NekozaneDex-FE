"use client";

import type { Chapter } from "@/features/story";
import { cn } from "@/shared/lib/utils";
import type { PageFitMode } from "./reader-settings";

interface ChapterContentProps {
  chapter: Chapter;
  zoom: number;
  pageFit?: PageFitMode;
}

const PAGE_FIT_STYLES: Record<PageFitMode, string> = {
  width: "w-full h-auto", // Fit to width (default)
  height: "w-auto h-screen object-contain", // Fit to viewport height
  original: "w-auto h-auto max-w-none", // Original size
};

export function ChapterContent({
  chapter,
  zoom,
  pageFit = "width",
}: ChapterContentProps) {
  return (
    <article className="container mx-auto py-4">
      <div
        className={cn(
          "mx-auto flex flex-col items-center gap-1 transition-all duration-300",
          pageFit === "original" && "overflow-x-auto",
        )}
        style={{
          width: pageFit === "original" ? "auto" : `${zoom}%`,
          maxWidth: pageFit === "original" ? "none" : "100%",
        }}
      >
        {/* Chapter Title */}
        <h1 className="text-xl font-bold mb-6 text-center">
          {chapter.chapter_label || `Chương ${chapter.chapter_number}`}:{" "}
          {chapter.title}
        </h1>

        {/* Chapter Images */}
        {chapter.images && chapter.images.length > 0 ? (
          chapter.images.map((imageUrl, index) => (
            <div
              key={index}
              className={cn(
                "relative bg-muted/20",
                pageFit === "width" && "w-full max-w-4xl",
                pageFit === "height" && "flex justify-center",
                pageFit === "original" && "flex justify-center",
              )}
            >
              <img
                src={imageUrl}
                alt={`Trang ${index + 1}`}
                className={cn("block", PAGE_FIT_STYLES[pageFit])}
                loading={index < 3 ? "eager" : "lazy"}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              Chương này chưa có nội dung.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
