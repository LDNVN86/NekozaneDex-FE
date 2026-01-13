import { Flame } from "lucide-react";
import { StoriesSection } from "@/shared/components/stories-section";
import type { Story } from "@/features/story/interface/story-interface";

interface HotStoriesSectionProps {
  stories: Story[];
}

export function HotStoriesSection({ stories }: HotStoriesSectionProps) {
  return (
    <StoriesSection
      stories={stories}
      icon={Flame}
      iconClassName="text-destructive"
      iconBgClassName="bg-destructive/10"
      title="Truyện Hot"
      linkHref="/client/rankings"
      linkText="Xem bảng xếp hạng"
      sectionClassName="bg-secondary/30"
      isHot
    />
  );
}
