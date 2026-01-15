"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import type { Chapter } from "@/features/story";

interface HorizontalReaderProps {
  chapter: Chapter;
  isVisible: boolean;
  onToggle: () => void;
  /** Report current page for progress saving */
  onPageChange?: (currentPage: number, totalPages: number) => void;
  /** Initial page to start from (for restoring progress) */
  initialPage?: number;
}

export function HorizontalReader({
  chapter,
  isVisible,
  onToggle,
  onPageChange,
  initialPage = 0,
}: HorizontalReaderProps) {
  const images = chapter.images || [];
  const totalPages = images.length;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    startIndex: initialPage,
    align: "center",
  });

  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  // Update scroll buttons state
  const updateButtons = React.useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  // Handle page change
  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    const page = emblaApi.selectedScrollSnap();
    setCurrentPage(page);
    onPageChange?.(page, totalPages);
  }, [emblaApi, onPageChange, totalPages]);

  React.useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", updateButtons);
    updateButtons();
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi, onSelect, updateButtons]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!emblaApi) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === "ArrowLeft") {
        emblaApi.scrollPrev();
      } else if (e.key === "ArrowRight") {
        emblaApi.scrollNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [emblaApi]);

  // Navigate to specific page
  const scrollTo = React.useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  if (totalPages === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <p className="text-muted-foreground">Chương này chưa có nội dung.</p>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-8rem)] bg-black">
      {/* Main carousel */}
      <div
        ref={emblaRef}
        className="overflow-hidden h-full cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex h-full">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="flex-none w-full h-full flex items-center justify-center p-2"
            >
              <img
                src={imageUrl}
                alt={`Trang ${index + 1}`}
                className="max-w-full max-h-full object-contain"
                loading={Math.abs(index - currentPage) < 3 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70",
          "transition-opacity duration-300",
          !canScrollPrev && "opacity-30 cursor-not-allowed",
          !isVisible && "opacity-0 pointer-events-none"
        )}
        onClick={(e) => {
          e.stopPropagation();
          emblaApi?.scrollPrev();
        }}
        disabled={!canScrollPrev}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70",
          "transition-opacity duration-300",
          !canScrollNext && "opacity-30 cursor-not-allowed",
          !isVisible && "opacity-0 pointer-events-none"
        )}
        onClick={(e) => {
          e.stopPropagation();
          emblaApi?.scrollNext();
        }}
        disabled={!canScrollNext}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Page indicator */}
      <div
        className={cn(
          "absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/70 text-white text-sm font-medium",
          "transition-opacity duration-300",
          !isVisible && "opacity-0"
        )}
      >
        {currentPage + 1} / {totalPages}
      </div>

      {/* Pagination dots (for small number of pages) */}
      {totalPages <= 20 && (
        <div
          className={cn(
            "absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5",
            "transition-opacity duration-300",
            !isVisible && "opacity-0"
          )}
        >
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentPage
                  ? "bg-primary w-4"
                  : "bg-white/50 hover:bg-white/80"
              )}
              onClick={(e) => {
                e.stopPropagation();
                scrollTo(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
