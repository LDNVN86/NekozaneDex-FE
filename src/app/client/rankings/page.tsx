"use client";
import Link from "next/link";
import { Trophy, Flame, TrendingUp, Eye, BookOpen, Medal } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/tabs";
import { Badge } from "@/shared/ui/badge";
import { mockStories } from "@/features/story/data/mock-data";
import { cn } from "@/shared/lib/utils";

const rankColors = ["text-yellow-500", "text-gray-400", "text-amber-600"];

export default function RankingsPage() {
  const sortedByViews = [...mockStories].sort(
    (a, b) => b.viewCount - a.viewCount
  );
  const sortedByChapters = [...mockStories].sort(
    (a, b) => b.chapterCount - a.chapterCount
  );

  const RankingList = ({ stories }: { stories: typeof mockStories }) => (
    <div className="space-y-3">
      {stories.map((story, index) => (
        <Link
          key={story.id}
          href={`/client/stories/${story.slug}`}
          className="flex items-center gap-4 p-4 rounded-xl bg-card border hover:border-primary hover:shadow-lg transition-all duration-200"
        >
          {/* Rank Number */}
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg shrink-0",
              index < 3 ? "bg-primary/10" : "bg-muted",
              index < 3 ? rankColors[index] : "text-muted-foreground"
            )}
          >
            {index < 3 ? <Medal className="h-5 w-5" /> : index + 1}
          </div>

          {/* Cover */}
          <img
            src={
              story.coverUrl ||
              `/placeholder.svg?height=80&width=60&query=${story.title} cover`
            }
            alt={story.title}
            className="w-14 h-20 object-cover rounded-lg shrink-0"
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">
              {story.title}
            </h3>
            <p className="text-sm text-muted-foreground">{story.author}</p>
            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                {story.viewCount.toLocaleString("vi-VN")}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="h-3 w-3" />
                {story.chapterCount} chương
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <Badge
            variant={story.status === "completed" ? "default" : "secondary"}
            className="shrink-0 hidden sm:flex"
          >
            {story.status === "completed" ? "Hoàn thành" : "Đang ra"}
          </Badge>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Trophy className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Bảng Xếp Hạng</h1>
          <p className="text-muted-foreground">
            Top truyện được yêu thích nhất
          </p>
        </div>
      </div>

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
          <RankingList stories={sortedByViews} />
        </TabsContent>

        <TabsContent value="chapters">
          <RankingList stories={sortedByChapters} />
        </TabsContent>

        <TabsContent value="trending">
          <RankingList stories={mockStories.filter((s) => s.isHot)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
