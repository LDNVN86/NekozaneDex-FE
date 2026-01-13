import { TrendingUp } from "lucide-react";
import { StoriesSection } from "@/shared/components/stories-section";
import type { Story } from "@/features/story/interface/story-interface";

interface LatestStoriesSectionProps {
  stories: Story[];
}

export function LatestStoriesSection({ stories }: LatestStoriesSectionProps) {
  return (
    <StoriesSection
      stories={stories}
      icon={TrendingUp}
      title="Truyện Mới Cập Nhật"
      linkHref="/client/stories"
      linkText="Xem tất cả"
      gridClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
      isHot={(story) => story.view_count > 1000}
    />
  );
}
