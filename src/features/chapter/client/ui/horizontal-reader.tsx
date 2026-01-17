"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/shared/lib/utils";
import type { Story, Chapter } from "@/features/story";
import { useHorizontalProgress } from "../hooks";

interface HorizontalReaderProps {
  story: Story;
  chapter: Chapter;
  isVisible: boolean;
  onToggle: () => void;
  savedScrollPosition?: number;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
}

/**
 * Horizontal/book page-flip reader.
 * Handles: page progress, keyboard nav (pages + chapter at boundary)
 */
export function HorizontalReader({
  story,
  chapter,
  isVisible,
  onToggle,
  savedScrollPosition,
  prevChapter,
  nextChapter,
}: HorizontalReaderProps) {
  const router = useRouter();
  const images = chapter.images || [];
  const totalPages = images.length;

  // Progress hook handles saving/loading page position
  const { currentPage, setCurrentPage } = useHorizontalProgress({
    storyId: story.id,
    chapterId: chapter.id,
    totalPages,
  });

  // Calculate initial page from saved position
  const initialPage = React.useMemo(() => {
    if (savedScrollPosition && savedScrollPosition > 0 && totalPages > 0) {
      return Math.floor((savedScrollPosition / 100) * totalPages);
    }
    return currentPage;
  }, [savedScrollPosition, totalPages, currentPage]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    startIndex: initialPage,
    align: "center",
    duration: 0, // Instant page change - no slide animation
    skipSnaps: true,
  });

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  // Carousel state sync
  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentPage(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect(); // Initial call

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, setCurrentPage]);

  // Navigation helpers
  const goToPrevChapter = React.useCallback(() => {
    if (prevChapter) {
      router.push(
        `/client/stories/${story.slug}/${prevChapter.chapter_number}`,
      );
    }
  }, [router, story.slug, prevChapter]);

  const goToNextChapter = React.useCallback(() => {
    if (nextChapter) {
      router.push(
        `/client/stories/${story.slug}/${nextChapter.chapter_number}`,
      );
    }
  }, [router, story.slug, nextChapter]);

  // Keyboard: arrows = pages, at boundary = chapter
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!emblaApi) return;
      if (e.target instanceof HTMLInputElement) return;

      if (e.key === "ArrowLeft") {
        if (emblaApi.canScrollPrev()) {
          emblaApi.scrollPrev();
        } else if (prevChapter) {
          goToPrevChapter();
        }
      } else if (e.key === "ArrowRight") {
        if (emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
        } else if (nextChapter) {
          goToNextChapter();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [emblaApi, prevChapter, nextChapter, goToPrevChapter, goToNextChapter]);

  if (totalPages === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <p className="text-muted-foreground">Chương này chưa có nội dung.</p>
      </div>
    );
  }

  // Handle tap zones: left 25% = prev, right 25% = next, center = toggle UI
  const handleTap = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const ratio = x / width;

      if (ratio < 0.25) {
        // Left zone - previous page
        if (emblaApi?.canScrollPrev()) {
          emblaApi.scrollPrev();
        } else if (prevChapter) {
          goToPrevChapter();
        }
      } else if (ratio > 0.75) {
        // Right zone - next page
        if (emblaApi?.canScrollNext()) {
          emblaApi.scrollNext();
        } else if (nextChapter) {
          goToNextChapter();
        }
      } else {
        // Center zone - toggle UI
        onToggle();
      }
    },
    [
      emblaApi,
      prevChapter,
      nextChapter,
      goToPrevChapter,
      goToNextChapter,
      onToggle,
    ],
  );

  return (
    <div className="relative h-[calc(100vh-8rem)] bg-black">
      {/* Carousel with tap zones */}
      <div
        ref={emblaRef}
        className="overflow-hidden h-full cursor-pointer"
        onClick={handleTap}
      >
        <div className="flex h-full">
          {images.map((url, i) => (
            <PageSlide
              key={i}
              src={url}
              alt={`Trang ${i + 1}`}
              isNear={Math.abs(i - currentPage) < 3}
            />
          ))}
        </div>
      </div>

      {/* Bottom progress bar - MangaDex style */}
      <ProgressBar
        currentPage={currentPage}
        totalPages={totalPages}
        isVisible={isVisible}
        onPageClick={(page) => emblaApi?.scrollTo(page)}
      />
    </div>
  );
}

// Bottom progress bar with clickable segments
function ProgressBar({
  currentPage,
  totalPages,
  isVisible,
  onPageClick,
}: {
  currentPage: number;
  totalPages: number;
  isVisible: boolean;
  onPageClick: (page: number) => void;
}) {
  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent",
        "flex items-end px-2 pb-1 gap-0.5",
        "transition-opacity duration-300",
        !isVisible && "opacity-0",
      )}
    >
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPageClick(i);
          }}
          className={cn(
            "flex-1 h-1.5 rounded-full transition-all",
            i === currentPage
              ? "bg-primary h-2"
              : i < currentPage
                ? "bg-white/60"
                : "bg-white/30 hover:bg-white/50",
          )}
          title={`Trang ${i + 1}`}
        />
      ))}
    </div>
  );
}

// Page slide with skeleton loading and double-tap zoom
function PageSlide({
  src,
  alt,
  isNear,
}: {
  src: string;
  alt: string;
  isNear: boolean;
}) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const lastTapRef = React.useRef(0);

  // Handle double-tap/click to zoom
  const handleTap = (e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap detected
      e.stopPropagation();
      setIsZoomed((prev) => !prev);
    }
    lastTapRef.current = now;
  };

  return (
    <div
      className="flex-none w-full h-full flex items-center justify-center p-2 relative overflow-auto"
      onClick={handleTap}
    >
      {/* Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-md h-full max-h-[80%] bg-muted/20 animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-muted-foreground/50 text-sm">Đang tải...</div>
          </div>
        </div>
      )}
      {/* Image with zoom */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "object-contain transition-all duration-200",
          isLoaded ? "opacity-100" : "opacity-0",
          isZoomed
            ? "scale-200 cursor-zoom-out"
            : "max-w-full max-h-full cursor-zoom-in",
        )}
        style={isZoomed ? { transformOrigin: "center center" } : undefined}
        loading={isNear ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        draggable={false}
      />
    </div>
  );
}
