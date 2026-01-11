import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { StoryCard } from "@/features/story/components/story-card";
import type { Story } from "@/features/story/interface/story-interface";

interface LatestStoriesSectionProps {
  stories: Story[];
}

export function LatestStoriesSection({ stories }: LatestStoriesSectionProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Truyện Mới Cập Nhật</h2>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/client/stories" className="gap-1">
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              id={story.id}
              title={story.title}
              slug={story.slug}
              coverUrl={story.cover_image_url}
              viewCount={story.view_count}
              chapterCount={story.total_chapters}
              isHot={story.view_count > 1000}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
