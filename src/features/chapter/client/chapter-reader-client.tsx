"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Story, Chapter } from "@/features/story";
import {
  useReaderSettings,
  useReaderControls,
  useFullscreen,
  useReaderFilters,
  useAutoScroll,
} from "./hooks";
import {
  ReaderHeader,
  ReaderFooter,
  ReaderLoading,
  VerticalReaderView,
  HorizontalReader,
  AutoScrollControl,
  LongStripReaderView,
} from "./ui";

interface ChapterReaderClientProps {
  story: Story;
  chapter: Chapter;
  chapters: Chapter[];
  savedScrollPosition?: number;
}

/**
 * Main chapter reader wrapper.
 * Shows loading state until settings load, then renders appropriate mode.
 */
export function ChapterReaderClient({
  story,
  chapter,
  chapters,
  savedScrollPosition,
}: ChapterReaderClientProps) {
  const router = useRouter();
  const [zoom, setZoom] = React.useState(100);

  // Load reader settings (mode, fit) from localStorage
  const { readingMode, pageFit, isLoaded, setReadingMode, setPageFit } =
    useReaderSettings();

  // UI controls
  const { isVisible, toggle, scrollProgress } = useReaderControls();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // Visual filters (brightness, color)
  const {
    brightness,
    colorFilter,
    setBrightness,
    setColorFilter,
    filterStyle,
  } = useReaderFilters();

  // Auto scroll for vertical and longstrip modes
  const isScrollMode =
    readingMode === "vertical" || readingMode === "longstrip";
  const {
    isScrolling,
    speed: scrollSpeed,
    toggle: toggleAutoScroll,
    setSpeed: setScrollSpeed,
  } = useAutoScroll({ enabled: isScrollMode });

  // Navigation helpers
  const { prevChapter, nextChapter, sortedChapters } = React.useMemo(() => {
    const sorted = [...chapters].sort(
      (a, b) => a.chapter_number - b.chapter_number,
    );
    const idx = sorted.findIndex(
      (c) => c.chapter_number === chapter.chapter_number,
    );
    return {
      sortedChapters: sorted,
      prevChapter: idx > 0 ? sorted[idx - 1] : null,
      nextChapter: idx < sorted.length - 1 ? sorted[idx + 1] : null,
    };
  }, [chapters, chapter.chapter_number]);

  const handleNavigate = (chapterNumber: number) => {
    router.push(`/client/stories/${story.slug}/${chapterNumber}`);
  };

  // Fullscreen keyboard shortcut (works in both modes)
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "f" || e.key === "F") toggleFullscreen();
      if (e.key === "Escape" && isFullscreen) toggle();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggleFullscreen, isFullscreen, toggle]);

  // Show loading skeleton until settings loaded
  if (!isLoaded) {
    return <ReaderLoading />;
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-black text-gray-200">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <ReaderHeader
        story={story}
        chapter={chapter}
        chapters={sortedChapters}
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
        brightness={brightness}
        onBrightnessChange={setBrightness}
        colorFilter={colorFilter}
        onColorFilterChange={setColorFilter}
      />

      {/* Render based on mode - apply visual filters */}
      <div style={filterStyle}>
        {readingMode === "horizontal" ? (
          <div className="pt-14 pb-16">
            <HorizontalReader
              story={story}
              chapter={chapter}
              isVisible={isVisible}
              onToggle={toggle}
              savedScrollPosition={savedScrollPosition}
              prevChapter={prevChapter}
              nextChapter={nextChapter}
            />
          </div>
        ) : readingMode === "longstrip" ? (
          <LongStripReaderView
            story={story}
            chapter={chapter}
            chapters={chapters}
            savedScrollPosition={savedScrollPosition}
            onToggleUI={toggle}
          />
        ) : (
          <VerticalReaderView
            story={story}
            chapter={chapter}
            chapters={chapters}
            zoom={zoom}
            pageFit={pageFit}
            savedScrollPosition={savedScrollPosition}
            onToggleUI={toggle}
          />
        )}
      </div>

      <ReaderFooter
        storySlug={story.slug}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        isVisible={isVisible}
      />

      {/* Auto scroll control - only in scroll modes */}
      {isScrollMode && (
        <AutoScrollControl
          isScrolling={isScrolling}
          speed={scrollSpeed}
          onToggle={toggleAutoScroll}
          onSpeedChange={setScrollSpeed}
          isVisible={isVisible}
        />
      )}
    </div>
  );
}
