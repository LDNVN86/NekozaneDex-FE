"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, History, Settings, BookOpen, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import {
  ProfileHeader,
  BookmarksTab,
  HistoryTab,
  SettingsTab,
  NotificationHistoryTab,
} from "./ui";
import type { ProfileUser, BookmarkItem, HistoryItem } from "../interfaces";
import type { Notification } from "@/features/notifications/server";

interface ProfileContentProps {
  user: ProfileUser;
  bookmarks: BookmarkItem[];
  history: HistoryItem[];
  notifications?: Notification[];
}

export function ProfileContent({
  user,
  bookmarks,
  history,
  notifications = [],
}: ProfileContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const defaultTab = tabParam || "bookmarks";
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Update URL without full page reload
    const url =
      tab === "bookmarks" ? "/client/profile" : `/client/profile?tab=${tab}`;
    router.replace(url, { scroll: false });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader
        user={user}
        bookmarkCount={bookmarks.length}
        historyCount={history.length}
      />

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="bookmarks" className="gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Đánh dấu</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Lịch sử</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Thông báo</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Cài đặt</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookmarks">
          {bookmarks.length > 0 ? (
            <BookmarksTab bookmarks={bookmarks} />
          ) : (
            <EmptyState
              icon={<Heart className="h-12 w-12" />}
              message="Chưa có truyện đánh dấu"
              description="Đánh dấu truyện yêu thích để đọc lại sau"
            />
          )}
        </TabsContent>

        <TabsContent value="history">
          {history.length > 0 ? (
            <HistoryTab history={history} />
          ) : (
            <EmptyState
              icon={<BookOpen className="h-12 w-12" />}
              message="Chưa có lịch sử đọc"
              description="Bắt đầu đọc truyện để lưu lịch sử của bạn"
            />
          )}
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab user={user} />
        </TabsContent>

        <TabsContent value="notifications">
          {notifications.length > 0 ? (
            <NotificationHistoryTab notifications={notifications} />
          ) : (
            <EmptyState
              icon={<Bell className="h-12 w-12" />}
              message="Chưa có thông báo"
              description="Thông báo mới sẽ xuất hiện ở đây"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({
  icon,
  message,
  description,
}: {
  icon: React.ReactNode;
  message: string;
  description: string;
}) {
  return (
    <div className="text-center py-12">
      <div className="text-muted-foreground/50 mx-auto mb-4">{icon}</div>
      <p className="text-muted-foreground">{message}</p>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
