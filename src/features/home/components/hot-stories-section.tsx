import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { StoryCard } from "@/features/story/components/story-card";
import type { Story } from "@/features/story/interface/story-interface";

interface HotStoriesSectionProps {
  stories: Story[];
}

export function HotStoriesSection({ stories }: HotStoriesSectionProps) {
  return (
    <section className="py-12 md:py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <Flame className="h-5 w-5 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Truyện Hot</h2>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/client/rankings" className="gap-1">
              Xem bảng xếp hạng
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              id={story.id}
              title={story.title}
              slug={story.slug}
              coverUrl={story.cover_image_url}
              viewCount={story.view_count}
              chapterCount={story.total_chapters}
              isHot
            />
          ))}
        </div>
      </div>
    </section>
  );
}
