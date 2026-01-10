"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Heart, History, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { mockStories } from "@/features/story/data/mock-data";
import { ProfileHeader, BookmarksTab, HistoryTab, SettingsTab } from "./ui";

const mockUser = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  avatar: "/diverse-user-avatars.png",
  joinedAt: "2024-01-15",
};

const mockBookmarks = mockStories.slice(0, 4);
const mockHistory = mockStories.slice(1, 5).map((story, i) => ({
  ...story,
  lastChapter: Math.floor(Math.random() * 50) + 1,
  lastReadAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
}));

export function ProfileContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const defaultTab = tabParam || "bookmarks";
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader
        user={mockUser}
        bookmarkCount={mockBookmarks.length}
        historyCount={mockHistory.length}
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="bookmarks" className="gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Đánh dấu</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Lịch sử</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Cài đặt</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookmarks">
          <BookmarksTab bookmarks={mockBookmarks} />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab history={mockHistory} />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab user={mockUser} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
