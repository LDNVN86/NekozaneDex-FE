import { StoriesCarouselSection } from "@/shared/components/stories-carousel-section";
import type { Story } from "@/features/story/interface/story-interface";

interface HotStoriesSectionProps {
  stories: Story[];
}

export function HotStoriesSection({ stories }: HotStoriesSectionProps) {
  return (
    <StoriesCarouselSection
      stories={stories}
      iconName="Flame"
      iconClassName="text-destructive"
      iconBgClassName="bg-destructive/10"
      title="Truyện Hot"
      linkHref="/client/rankings"
      linkText="Xem bảng xếp hạng"
      sectionClassName="bg-secondary/30"
      showHotBadge="all"
    />
  );
}
