"use client";

import * as React from "react";
import type { Story, Chapter } from "@/features/story";
import type { Comment } from "@/features/comments/server";
import { StoryHeader, ChapterList, CommentSection, StoryRating } from "./ui";

interface StoryDetailClientProps {
  story: Story;
  chapters: Chapter[];
  totalChapters?: number;
  initialBookmarked?: boolean;
  comments?: Comment[];
  totalComments?: number;
  totalCommentPages?: number;
  currentUserId?: string;
  isAdmin?: boolean;
}

export function StoryDetailClient({
  story,
  chapters,
  totalChapters = 0,
  initialBookmarked = false,
  comments = [],
  totalComments = 0,
  totalCommentPages = 1,
  currentUserId,
  isAdmin = false,
}: StoryDetailClientProps) {
  const newestChapterNumber = React.useMemo(() => {
    if (chapters.length === 0) return undefined;
    return Math.max(...chapters.map((c) => c.chapter_number));
  }, [chapters]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <StoryHeader
        story={story}
        chapters={chapters}
        newestChapterNumber={newestChapterNumber}
        initialBookmarked={initialBookmarked}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 items-start">
        {/* Chapters - Main Column */}
        <div className="lg:col-span-2">
          <ChapterList
            storySlug={story.slug}
            chapters={chapters}
            totalChapters={totalChapters}
          />
        </div>

        {/* Sidebar - Story Info */}
        <aside className="lg:mt-10">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border/30">
              <h3 className="font-semibold text-sm">Thông tin truyện</h3>
            </div>

            <div className="divide-y divide-border/20">
              <InfoRow
                label="Trạng thái"
                value={
                  story.status === "ongoing"
                    ? "Đang ra"
                    : story.status === "completed"
                      ? "Hoàn thành"
                      : "Tạm ngưng"
                }
                highlight
              />
              <InfoRow
                label="Lượt xem"
                value={story.view_count?.toLocaleString() || "0"}
              />
              <InfoRow label="Số chương" value={chapters.length.toString()} />

              {/* Interactive Rating */}
              <div className="px-4 py-3 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-2">Đánh giá</p>
                <StoryRating
                  storyId={story.id}
                  storySlug={story.slug}
                  initialRating={story.rating}
                  initialRatingCount={story.rating_count}
                  isAuthenticated={!!currentUserId}
                />
              </div>
              {story.country && (
                <InfoRow
                  label="Quốc gia"
                  value={
                    story.country === "japan"
                      ? "🇯🇵 Nhật Bản"
                      : story.country === "korea"
                        ? "🇰🇷 Hàn Quốc"
                        : story.country === "china"
                          ? "🇨🇳 Trung Quốc"
                          : story.country
                  }
                />
              )}
              {story.release_year && (
                <InfoRow
                  label="Năm ra mắt"
                  value={`${story.release_year}${story.end_year ? ` - ${story.end_year}` : ""}`}
                />
              )}
            </div>

            {/* Genres */}
            {story.genres && story.genres.length > 0 && (
              <div className="p-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-2">Thể loại</p>
                <div className="flex flex-wrap gap-1.5">
                  {story.genres.map((genre) => (
                    <a
                      key={genre.id}
                      href={`/client/genres/${genre.slug}`}
                      className="px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      {genre.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Comments - Full Width */}
      <div className="mt-10">
        <CommentSection
          storyId={story.id}
          storySlug={story.slug}
          comments={comments}
          totalComments={totalComments}
          totalPages={totalCommentPages}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function InfoRow({ label, value, highlight }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`text-sm font-medium ${highlight ? "text-primary" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
