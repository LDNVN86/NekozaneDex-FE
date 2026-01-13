"use client";

import * as React from "react";
import Link from "next/link";
import {
  Eye,
  BookOpen,
  Heart,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";
import { cn } from "@/shared/lib/utils";
import { HtmlContent } from "@/shared/components/html-content";
import type { Story, Genre, Chapter } from "@/features/story";

interface StoryHeaderProps {
  story: Story;
  chapters: Chapter[];
  newestChapterNumber?: number;
}

export function StoryHeader({
  story,
  chapters,
  newestChapterNumber,
}: StoryHeaderProps) {
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [synopsisOpen, setSynopsisOpen] = React.useState(true);

  const formatNumber = (num: number) => num.toLocaleString("vi-VN");

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      ongoing: "Đang ra",
      completed: "Hoàn thành",
      paused: "Tạm ngưng",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 mb-10">
      {/* Cover Image */}
      <div className="shrink-0">
        <div className="relative w-full max-w-[280px] mx-auto lg:mx-0 aspect-3/4 rounded-xl overflow-hidden shadow-xl">
          <img
            src={
              story.cover_image_url ||
              `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(
                story.title + " novel cover"
              )}`
            }
            alt={story.title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Story Info */}
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-balance">
            {story.title}
          </h1>
          {story.author_name && (
            <div className="flex items-center gap-2 mt-3 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{story.author_name}</span>
            </div>
          )}
        </div>

        {/* Status & Stats */}
        <div className="flex flex-wrap items-center gap-4">
          <Badge
            variant={story.status === "completed" ? "default" : "secondary"}
            className="text-sm px-3 py-1"
          >
            {getStatusLabel(story.status)}
          </Badge>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{formatNumber(story.view_count)} lượt đọc</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{story.total_chapters} chương</span>
          </div>
        </div>

        {/* Genres */}
        {story.genres && story.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {story.genres.map((genre: Genre) => (
              <Link key={genre.id} href={`/client/stories?genre=${genre.slug}`}>
                <Badge
                  variant="outline"
                  className="hover:bg-secondary transition-colors cursor-pointer"
                >
                  {genre.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Synopsis */}
        <Collapsible open={synopsisOpen} onOpenChange={setSynopsisOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between px-0 hover:bg-transparent"
            >
              <span className="font-semibold">Giới thiệu</span>
              {synopsisOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <HtmlContent
              html={story.description || ""}
              fallback="Chưa có mô tả cho truyện này."
              className="text-muted-foreground leading-relaxed"
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <Button size="lg" asChild>
            <Link href={`/client/stories/${story.slug}/1`}>
              <BookOpen className="h-5 w-5 mr-2" />
              Đọc từ đầu
            </Link>
          </Button>
          {chapters.length > 0 && newestChapterNumber && (
            <Button size="lg" variant="outline" asChild>
              <Link
                href={`/client/stories/${story.slug}/${newestChapterNumber}`}
              >
                Đọc chương mới nhất
              </Link>
            </Button>
          )}
          <Button
            size="lg"
            variant={isBookmarked ? "default" : "outline"}
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={cn(
              isBookmarked &&
                "bg-pink-500 hover:bg-pink-600 border-pink-500 text-white"
            )}
          >
            <Heart
              className={cn("h-5 w-5 mr-2", isBookmarked && "fill-current")}
            />
            {isBookmarked ? "Đã đánh dấu" : "Đánh dấu"}
          </Button>
        </div>
      </div>
    </div>
  );
}
