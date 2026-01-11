"use client";

import { Flame, BookOpen, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { RankingList } from "./ranking-list";
import type { Story } from "@/features/story/interface/story-interface";

interface RankingsTabsProps {
  byViews: Story[];
  byChapters: Story[];
  trending: Story[];
}

export function RankingsTabs({
  byViews,
  byChapters,
  trending,
}: RankingsTabsProps) {
  return (
    <Tabs defaultValue="views" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 max-w-lg">
        <TabsTrigger value="views" className="gap-2">
          <Flame className="h-4 w-4" />
          <span className="hidden sm:inline">Lượt xem</span>
        </TabsTrigger>
        <TabsTrigger value="chapters" className="gap-2">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Số chương</span>
        </TabsTrigger>
        <TabsTrigger value="trending" className="gap-2">
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Xu hướng</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="views">
        <RankingList stories={byViews} />
      </TabsContent>

      <TabsContent value="chapters">
        <RankingList stories={byChapters} />
      </TabsContent>

      <TabsContent value="trending">
        <RankingList stories={trending} />
      </TabsContent>
    </Tabs>
  );
}
