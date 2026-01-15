"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpDown, Clock, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { Chapter } from "@/features/story";

interface ChapterListProps {
  storySlug: string;
  chapters: Chapter[];
}

const CHAPTER_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  extra: {
    label: "Extra",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  bonus: {
    label: "Bonus",
    color: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  },
  omake: {
    label: "Omake",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
};

export function ChapterList({ storySlug, chapters }: ChapterListProps) {
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const sortedChapters = React.useMemo(() => {
    return [...chapters].sort((a, b) => {
      // Use ordering if available, otherwise chapter_number
      const orderA = a.ordering ?? a.chapter_number;
      const orderB = b.ordering ?? b.chapter_number;
      return sortOrder === "desc" ? orderB - orderA : orderA - orderB;
    });
  }, [chapters, sortOrder]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Check if chapter is new (within 7 days)
  const isNewChapter = (dateString?: string) => {
    if (!dateString) return false;
    const publishDate = new Date(dateString);
    const now = new Date();
    const diffDays =
      (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  // Get chapter display label
  const getChapterLabel = (chapter: Chapter) => {
    if (chapter.chapter_label) return chapter.chapter_label;
    return `Chương ${chapter.chapter_number}`;
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Danh sách chương
          <span className="text-muted-foreground font-normal">
            ({chapters.length})
          </span>
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder((o) => (o === "desc" ? "asc" : "desc"))}
          className="gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          {sortOrder === "desc" ? "Mới nhất" : "Cũ nhất"}
        </Button>
      </div>

      {chapters.length > 0 ? (
        <div className="border rounded-xl overflow-hidden bg-card/30">
          <div className="max-h-[600px] overflow-y-auto">
            <div className="divide-y divide-border/50">
              {sortedChapters.map((chapter) => {
                const typeConfig = chapter.chapter_type
                  ? CHAPTER_TYPE_CONFIG[chapter.chapter_type]
                  : null;
                const isNew = isNewChapter(chapter.published_at);

                return (
                  <Link
                    key={chapter.id}
                    href={`/client/stories/${storySlug}/${chapter.chapter_number}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Chapter number/label */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-primary group-hover:underline">
                          {getChapterLabel(chapter)}
                        </span>
                        {typeConfig && (
                          <Badge
                            className={cn(
                              "text-[10px] px-1.5 py-0 h-5 border",
                              typeConfig.color
                            )}
                          >
                            {typeConfig.label}
                          </Badge>
                        )}
                        {isNew && (
                          <Badge className="text-[10px] px-1.5 py-0 h-5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <Sparkles className="h-3 w-3 mr-0.5" />
                            Mới
                          </Badge>
                        )}
                      </div>
                      {/* Title (hidden on mobile if too long) */}
                      {chapter.title && (
                        <span className="text-muted-foreground text-sm truncate hidden sm:inline">
                          - {chapter.title}
                        </span>
                      )}
                    </div>
                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 ml-4">
                      <Clock className="h-3 w-3" />
                      {formatDate(chapter.published_at || chapter.created_at)}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 border rounded-xl bg-card/30">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Chưa có chương nào được đăng</p>
        </div>
      )}
    </section>
  );
}
