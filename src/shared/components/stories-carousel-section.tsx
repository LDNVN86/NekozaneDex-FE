"use client";

import { TrendingUp, Flame, Star, Clock } from "lucide-react";
import { StoryCard } from "@/features/story/components/story-card";
import { SectionHeader } from "./section-header";
import { ScrollCarousel } from "./scroll-carousel";
import { cn } from "@/shared/lib/utils";
import type { Story } from "@/features/story/interface/story-interface";

const iconMap = {
  TrendingUp,
  Flame,
  Star,
  Clock,
} as const;

type IconName = keyof typeof iconMap;

interface StoriesCarouselSectionProps {
  stories: Story[];
  iconName: IconName;
  iconClassName?: string;
  iconBgClassName?: string;
  title: string;
  linkHref: string;
  linkText: string;
  sectionClassName?: string;
  /** "all" = all hot, "auto" = based on view count, "none" = no hot badges */
  showHotBadge?: "all" | "auto" | "none";
}

export function StoriesCarouselSection({
  stories,
  iconName,
  iconClassName,
  iconBgClassName,
  title,
  linkHref,
  linkText,
  sectionClassName,
  showHotBadge = "none",
}: StoriesCarouselSectionProps) {
  const Icon = iconMap[iconName];

  const isHot = (story: Story) => {
    if (showHotBadge === "all") return true;
    if (showHotBadge === "auto") return story.view_count > 1000;
    return false;
  };

  return (
    <section className={cn("py-12 md:py-16", sectionClassName)}>
      <div className="container mx-auto px-4">
        <SectionHeader
          icon={Icon}
          iconClassName={iconClassName}
          iconBgClassName={iconBgClassName}
          title={title}
          linkHref={linkHref}
          linkText={linkText}
        />
        <ScrollCarousel gap={16}>
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="shrink-0 w-[140px] sm:w-[160px] md:w-[180px] animate-in fade-in duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <StoryCard
                id={story.id}
                title={story.title}
                slug={story.slug}
                coverUrl={story.cover_image_url}
                viewCount={story.view_count}
                chapterCount={story.total_chapters}
                isHot={isHot(story)}
              />
            </div>
          ))}
        </ScrollCarousel>
      </div>
    </section>
  );
}
