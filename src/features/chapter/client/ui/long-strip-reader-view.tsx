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
 * Long strip / Webtoon reading mode.
 * Edge-to-edge images with no gaps for continuous scroll experience.
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
      {/* Edge-to-edge images with no gaps */}
      <div className="flex flex-col items-center">
        {images.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`Trang ${i + 1}`}
            className="w-full max-w-4xl object-contain"
            loading={i < 5 ? "eager" : "lazy"}
            style={{ margin: 0, padding: 0, display: "block" }}
          />
        ))}
      </div>
    </div>
  );
}
