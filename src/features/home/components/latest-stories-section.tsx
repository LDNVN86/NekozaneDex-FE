import { StoriesCarouselSection } from "@/shared/components/stories-carousel-section";
import type { Story } from "@/features/story/interface/story-interface";

interface LatestStoriesSectionProps {
  stories: Story[];
}

export function LatestStoriesSection({ stories }: LatestStoriesSectionProps) {
  return (
    <StoriesCarouselSection
      stories={stories}
      iconName="TrendingUp"
      title="Truyện Mới Cập Nhật"
      linkHref="/client/stories"
      linkText="Xem tất cả"
      showHotBadge="auto"
    />
  );
}
