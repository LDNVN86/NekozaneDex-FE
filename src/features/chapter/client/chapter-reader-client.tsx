"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Story, Chapter } from "@/features/story";
import { ReaderHeader, ChapterContent, ReaderFooter } from "./ui";

interface ChapterReaderClientProps {
  story: Story;
  chapter: Chapter;
  chapters: Chapter[];
}

export function ChapterReaderClient({
  story,
  chapter,
  chapters,
}: ChapterReaderClientProps) {
  const router = useRouter();
  const [zoom, setZoom] = React.useState(100);
  const [scrollProgress, setScrollProgress] = React.useState(0);

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

  // Scroll progress tracking
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = (scrollTop / docHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === "ArrowLeft" && prevChapter) {
        router.push(
          `/client/stories/${story.slug}/${prevChapter.chapter_number}`
        );
      } else if (e.key === "ArrowRight" && nextChapter) {
        router.push(
          `/client/stories/${story.slug}/${nextChapter.chapter_number}`
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevChapter, nextChapter, story.slug, router]);

  const handleNavigate = (chapterNumber: number) => {
    router.push(`/client/stories/${story.slug}/${chapterNumber}`);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-black text-gray-200">
      {/* Progress Bar */}
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
      />

      <ChapterContent chapter={chapter} zoom={zoom} />

      <ReaderFooter
        storySlug={story.slug}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
      />
    </div>
  );
}
