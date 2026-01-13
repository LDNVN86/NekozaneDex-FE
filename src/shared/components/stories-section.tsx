import { type LucideIcon } from "lucide-react";
import { StoryCard } from "@/features/story/components/story-card";
import { SectionHeader } from "./section-header";
import { cn } from "@/shared/lib/utils";
import type { Story } from "@/features/story/interface/story-interface";

interface StoriesSectionProps {
  stories: Story[];
  icon: LucideIcon;
  iconClassName?: string;
  iconBgClassName?: string;
  title: string;
  linkHref: string;
  linkText: string;
  sectionClassName?: string;
  gridClassName?: string;
  isHot?: boolean | ((story: Story) => boolean);
}

export function StoriesSection({
  stories,
  icon,
  iconClassName,
  iconBgClassName,
  title,
  linkHref,
  linkText,
  sectionClassName,
  gridClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6",
  isHot,
}: StoriesSectionProps) {
  return (
    <section className={cn("py-12 md:py-16", sectionClassName)}>
      <div className="container mx-auto px-4">
        <SectionHeader
          icon={icon}
          iconClassName={iconClassName}
          iconBgClassName={iconBgClassName}
          title={title}
          linkHref={linkHref}
          linkText={linkText}
        />
        <div className={cn("grid", gridClassName)}>
          {stories.map((story) => {
            const showHot = typeof isHot === "function" ? isHot(story) : isHot;
            return (
              <StoryCard
                key={story.id}
                id={story.id}
                title={story.title}
                slug={story.slug}
                coverUrl={story.cover_image_url}
                viewCount={story.view_count}
                chapterCount={story.total_chapters}
                isHot={showHot}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
