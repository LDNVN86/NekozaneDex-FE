"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, List, Settings, Home } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Slider } from "@/shared/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { mockStories, mockChapters, mockMangaPages } from "@/features/story/data/mock-data";
import { cn } from "@/shared/lib/utils";

export default function ChapterReaderPage() {
  const params = useParams();
  const slug = params.slug as string;
  const chapter = params.chapter as string;

  const router = useRouter();
  const chapterNum = Number.parseInt(chapter, 10);

  const [zoom, setZoom] = React.useState(100);
  const [showSettings, setShowSettings] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);

  const story = mockStories.find((s) => s.slug === slug) || mockStories[0];
  const currentChapter =
    mockChapters.find((c) => c.number === chapterNum) || mockChapters[0];
  const totalChapters = mockChapters.length;

  // Handle scroll progress
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && chapterNum > 1) {
        router.push(`/stories/${slug}/${chapterNum - 1}`);
      } else if (e.key === "ArrowRight" && chapterNum < totalChapters) {
        router.push(`/stories/${slug}/${chapterNum + 1}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [chapterNum, slug, totalChapters, router]);

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300 bg-black text-gray-200"
      )}
    >
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Header */}
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-black/95 border-gray-800 backdrop-blur-sm"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left - Back & Story Title */}
            <div className="flex items-center gap-2 min-w-0">
              <Button variant="ghost" size="icon" asChild className="shrink-0">
                <Link href={`/client/stories/${slug}`}>
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
              <Link
                href={`/client/stories/${slug}`}
                className="font-medium truncate hover:text-primary transition-colors text-sm"
              >
                {story.title}
              </Link>
            </div>

            {/* Center - Chapter Navigation */}
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                disabled={chapterNum <= 1}
                onClick={() =>
                  router.push(`/stories/${slug}/${chapterNum - 1}`)
                }
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="text-sm font-medium px-2">
                Chương {chapterNum}/{totalChapters}
              </span>
              <Button
                variant="ghost"
                size="icon"
                disabled={chapterNum >= totalChapters}
                onClick={() =>
                  router.push(`/stories/${slug}/${chapterNum + 1}`)
                }
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Right - Settings */}
            <div className="flex items-center gap-1">
              <Popover open={showSettings} onOpenChange={setShowSettings}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-6">
                    <h4 className="font-semibold text-center">
                      Cài đặt đọc Manga
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Phóng to: {zoom}%</span>
                      </div>
                      <Slider
                        value={[zoom]}
                        min={50}
                        max={150}
                        step={10}
                        onValueChange={([v]) => setZoom(v)}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Home */}
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <Home className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <article className="container mx-auto py-4">
        <div
          className="mx-auto flex flex-col items-center gap-1 transition-all duration-300"
          style={{ width: `${zoom}%`, maxWidth: "100%" }}
        >
          <h1 className="text-xl font-bold mb-6">{currentChapter.title}</h1>

          {mockMangaPages.map((page, index) => (
            <div
              key={index}
              className="relative w-full max-w-4xl bg-muted animate-pulse aspect-[2/3] md:aspect-auto"
            >
              <img
                src={page || "/placeholder.svg"}
                alt={`Trang ${index + 1}`}
                className="w-full h-auto block"
                onLoad={(e) =>
                  (e.currentTarget.parentElement!.className =
                    "relative w-full max-w-4xl")
                }
              />
            </div>
          ))}
        </div>
      </article>

      {/* Bottom Navigation */}
      <footer
        className={cn(
          "sticky bottom-0 border-t py-4 bg-black/95 border-gray-800 backdrop-blur-sm"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <Button
              variant="outline"
              disabled={chapterNum <= 1}
              asChild={chapterNum > 1}
            >
              {chapterNum > 1 ? (
                <Link href={`/client/stories/${slug}/${chapterNum - 1}`}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Chương trước
                </Link>
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Chương trước
                </>
              )}
            </Button>

            <Button variant="ghost" asChild>
              <Link href={`/client/stories/${slug}`}>
                <List className="h-4 w-4 mr-2" />
                Mục lục
              </Link>
            </Button>

            <Button
              variant="outline"
              disabled={chapterNum >= totalChapters}
              asChild={chapterNum < totalChapters}
            >
              {chapterNum < totalChapters ? (
                <Link href={`/client/stories/${slug}/${chapterNum + 1}`}>
                  Chương sau
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              ) : (
                <>
                  Chương sau
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
