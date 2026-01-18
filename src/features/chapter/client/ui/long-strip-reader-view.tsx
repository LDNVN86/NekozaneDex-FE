"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Story, Chapter } from "@/features/story";
import { useReadingProgress } from "@/features/reading-history";
import { cn } from "@/shared/lib/utils";

interface LongStripReaderViewProps {
  story: Story;
  chapter: Chapter;
  chapters: Chapter[];
  savedScrollPosition?: number;
  onToggleUI: () => void;
}

/**
 * Progressive Image component with skeleton loading
 */
function ProgressiveImage({
  src,
  alt,
  index,
  shouldLoad,
  onVisible,
}: {
  src: string;
  alt: string;
  index: number;
  shouldLoad: boolean;
  onVisible: (index: number) => void;
}) {
  const imageRef = React.useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  // Intersection Observer for visibility detection
  React.useEffect(() => {
    const el = imageRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onVisible(index);
          }
        });
      },
      { rootMargin: "200px" }, // Pre-load when 200px before entering viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index, onVisible]);

  return (
    <div
      ref={imageRef}
      className="relative w-full max-w-4xl"
      style={{ minHeight: isLoaded ? "auto" : "300px" }}
    >
      {/* Skeleton placeholder */}
      {!isLoaded && !hasError && shouldLoad && (
        <div className="absolute inset-0 bg-muted/30 animate-pulse flex items-center justify-center">
          <div className="text-muted-foreground/50 text-sm">
            Đang tải trang {index + 1}...
          </div>
        </div>
      )}

      {/* Placeholder when not loading yet */}
      {!shouldLoad && !isLoaded && (
        <div className="h-[300px] bg-muted/20 flex items-center justify-center">
          <div className="text-muted-foreground/30 text-sm">
            Trang {index + 1}
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="h-[200px] bg-destructive/10 flex items-center justify-center">
          <div className="text-destructive text-sm">
            Không thể tải trang {index + 1}
          </div>
        </div>
      )}

      {/* Actual image */}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full object-contain transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          style={{ margin: 0, padding: 0, display: "block" }}
        />
      )}
    </div>
  );
}

/**
 * Long strip / Webtoon reading mode.
 * Edge-to-edge images with progressive loading for smooth experience.
 */
export function LongStripReaderView({
  story,
  chapter,
  chapters,
  savedScrollPosition,
  onToggleUI,
}: LongStripReaderViewProps) {
  const router = useRouter();
  const hasScrolledRef = React.useRef(false);
  const images = chapter.images || [];

  // Track which images should be loaded (5 initially + 3 ahead of visible)
  const [loadedIndices, setLoadedIndices] = React.useState<Set<number>>(
    () => new Set([0, 1, 2, 3, 4]),
  );

  // Auto-save scroll progress
  useReadingProgress(story.id, chapter.id);

  // Calculate prev/next chapters
  const { prevChapter, nextChapter } = React.useMemo(() => {
    const sorted = [...chapters].sort(
      (a, b) => a.chapter_number - b.chapter_number,
    );
    const idx = sorted.findIndex(
      (c) => c.chapter_number === chapter.chapter_number,
    );
    return {
      prevChapter: idx > 0 ? sorted[idx - 1] : null,
      nextChapter: idx < sorted.length - 1 ? sorted[idx + 1] : null,
    };
  }, [chapters, chapter.chapter_number]);

  // Handle image visibility - preload next 3
  const handleImageVisible = React.useCallback(
    (index: number) => {
      setLoadedIndices((prev) => {
        const next = new Set(prev);
        // Add current and next 3 images
        for (let i = index; i <= Math.min(index + 3, images.length - 1); i++) {
          next.add(i);
        }
        return next;
      });
    },
    [images.length],
  );

  // Restore scroll position
  React.useEffect(() => {
    if (hasScrolledRef.current) return;
    hasScrolledRef.current = true;

    if (savedScrollPosition && savedScrollPosition > 0) {
      setTimeout(() => {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        if (docH > 0) {
          window.scrollTo({
            top: (savedScrollPosition / 100) * docH,
            behavior: "smooth",
          });
        }
      }, 300);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [chapter.id, savedScrollPosition]);

  // Keyboard: arrows = chapters
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowLeft" && prevChapter) {
        router.push(
          `/client/stories/${story.slug}/${prevChapter.chapter_number}`,
        );
      } else if (e.key === "ArrowRight" && nextChapter) {
        router.push(
          `/client/stories/${story.slug}/${nextChapter.chapter_number}`,
        );
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [router, story.slug, prevChapter, nextChapter]);

  if (images.length === 0) {
    return (
      <div className="pt-14 pb-16 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chương này chưa có nội dung.</p>
      </div>
    );
  }

  return (
    <div
      className="pt-14 pb-16 cursor-pointer bg-black"
      onClick={onToggleUI}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === " " && onToggleUI()}
    >
      {/* Edge-to-edge images with progressive loading */}
      <div className="flex flex-col items-center">
        {images.map((url, i) => (
          <ProgressiveImage
            key={`${chapter.id}-${i}`}
            src={url}
            alt={`Trang ${i + 1}`}
            index={i}
            shouldLoad={loadedIndices.has(i)}
            onVisible={handleImageVisible}
          />
        ))}
      </div>
    </div>
  );
}
