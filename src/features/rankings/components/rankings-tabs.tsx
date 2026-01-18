"use client";

import { Flame, Star, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { RankingList } from "./ranking-list";
import type { Story } from "@/features/story/interface/story-interface";

interface RankingsTabsProps {
  byViews: Story[];
  byRating: Story[];
  trending: Story[];
}

export function RankingsTabs({
  byViews,
  byRating,
  trending,
}: RankingsTabsProps) {
  return (
    <Tabs defaultValue="views" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
        <TabsTrigger value="views" className="gap-2">
          <Flame className="h-4 w-4" />
          <span className="hidden sm:inline">Lượt xem</span>
        </TabsTrigger>
        <TabsTrigger value="rating" className="gap-2">
          <Star className="h-4 w-4" />
          <span className="hidden sm:inline">Đánh giá</span>
        </TabsTrigger>
        <TabsTrigger value="trending" className="gap-2">
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Xu hướng</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="views">
        <RankingList stories={byViews} />
      </TabsContent>

      <TabsContent value="rating">
        <RankingList stories={byRating} showRating />
      </TabsContent>

      <TabsContent value="trending">
        <RankingList stories={trending} />
      </TabsContent>
    </Tabs>
  );
}
