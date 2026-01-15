"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Story, Chapter } from "@/features/story";
import { useReadingProgress } from "@/features/reading-history";
import { useReaderControls, useFullscreen } from "./hooks";
import {
  ReaderHeader,
  ChapterContent,
  ReaderFooter,
  HorizontalReader,
} from "./ui";
import type { PageFitMode, ReadingMode } from "./ui/reader-settings";

interface ChapterReaderClientProps {
  story: Story;
  chapter: Chapter;
  chapters: Chapter[];
  savedScrollPosition?: number;
}

export function ChapterReaderClient({
  story,
  chapter,
  chapters,
  savedScrollPosition,
}: ChapterReaderClientProps) {
  const router = useRouter();
  const [zoom, setZoom] = React.useState(100);
  const [pageFit, setPageFit] = React.useState<PageFitMode>("width");
  const [readingMode, setReadingMode] = React.useState<ReadingMode>("vertical");
  const hasScrolledRef = React.useRef(false);

  // Reader controls: auto-hide UI
  const { isVisible, toggle, scrollProgress } = useReaderControls();

  // Fullscreen control
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // Auto-save reading progress
  useReadingProgress(story.id, chapter.id);

  // Handle scroll on chapter load - runs on every chapter change
  React.useLayoutEffect(() => {
    // Reset flag on chapter change
    hasScrolledRef.current = false;
  }, [chapter.id]);

  React.useEffect(() => {
    if (hasScrolledRef.current) return;
    hasScrolledRef.current = true;

    // If we have saved position > 0:  This means came from "Đọc tiếp"
    // Otherwise scroll to top (new chapter or normal navigation)
    if (savedScrollPosition && savedScrollPosition > 0) {
      // Delay to wait for content to render
      const timer = setTimeout(() => {
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          const scrollTo = (savedScrollPosition / 100) * docHeight;
          window.scrollTo({ top: scrollTo, behavior: "smooth" });
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // Scroll to top immediately for normal chapter navigation
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [chapter.id, savedScrollPosition]);

  // Derived data
  const sortedChapters = React.useMemo(() => {
    return [...chapters].sort((a, b) => a.chapter_number - b.chapter_number);
  }, [chapters]);

  const currentIndex = sortedChapters.findIndex(
    (c) => c.chapter_number === chapter.chapter_number
  );
  const prevChapter =
    currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < sortedChapters.length - 1
      ? sortedChapters[currentIndex + 1]
      : null;

  // Note: scrollProgress now comes from useReaderControls hook

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
          if (prevChapter) {
            router.push(
              `/client/stories/${story.slug}/${prevChapter.chapter_number}`
            );
          }
          break;
        case "ArrowRight":
          if (nextChapter) {
            router.push(
              `/client/stories/${story.slug}/${nextChapter.chapter_number}`
            );
          }
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "Escape":
          // ESC exits fullscreen (browser handles this, but show UI)
          if (isFullscreen) toggle();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    prevChapter,
    nextChapter,
    story.slug,
    router,
    toggleFullscreen,
    isFullscreen,
    toggle,
  ]);

  const handleNavigate = (chapterNumber: number) => {
    router.push(`/client/stories/${story.slug}/${chapterNumber}`);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-black text-gray-200">
      {/* Progress Bar - always visible at top */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <ReaderHeader
        story={story}
        chapter={chapter}
        chapters={chapters}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        totalChapters={chapters.length}
        zoom={zoom}
        onZoomChange={setZoom}
        onNavigate={handleNavigate}
        isVisible={isVisible}
        pageFit={pageFit}
        onPageFitChange={setPageFit}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        readingMode={readingMode}
        onReadingModeChange={setReadingMode}
      />

      {/* Content area - switches between vertical and horizontal modes */}
      {readingMode === "horizontal" ? (
        <div className="pt-14 pb-16">
          <HorizontalReader
            chapter={chapter}
            isVisible={isVisible}
            onToggle={toggle}
            initialPage={
              savedScrollPosition
                ? Math.floor(
                    (savedScrollPosition / 100) * (chapter.images?.length || 1)
                  )
                : 0
            }
          />
        </div>
      ) : (
        <div
          className="pt-14 pb-16 cursor-pointer"
          onClick={toggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === " " && toggle()}
        >
          <ChapterContent chapter={chapter} zoom={zoom} pageFit={pageFit} />
        </div>
      )}

      <ReaderFooter
        storySlug={story.slug}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        isVisible={isVisible}
      />
    </div>
  );
}
