"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Heart,
  History,
  Settings,
  Edit,
  Camera,
  BookOpen,
  Eye,
  Trash2,
  Clock,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { mockStories } from "@/features/story/data/mock-data";

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
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 p-6 bg-card border rounded-xl">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={mockUser.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl">
              {mockUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{mockUser.name}</h1>
          <p className="text-muted-foreground">{mockUser.email}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Thành viên từ{" "}
            {new Date(mockUser.joinedAt).toLocaleDateString("vi-VN")}
          </p>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {mockBookmarks.length}
            </p>
            <p className="text-sm text-muted-foreground">Đánh dấu</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {mockHistory.length}
            </p>
            <p className="text-sm text-muted-foreground">Đã đọc</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
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

        {/* Bookmarks Tab */}
        <TabsContent value="bookmarks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Truyện đánh dấu
              </CardTitle>
              <CardDescription>
                Danh sách truyện bạn đã đánh dấu để đọc sau
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockBookmarks.length > 0 ? (
                <div className="space-y-4">
                  {mockBookmarks.map((story) => (
                    <div
                      key={story.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <img
                        src={
                          story.coverUrl ||
                          `/placeholder.svg?height=80&width=60&query=${story.title} cover`
                        }
                        alt={story.title}
                        className="w-14 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/client/stories/${story.slug}`}
                          className="font-medium hover:text-primary line-clamp-1"
                        >
                          {story.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {story.author}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {story.chapterCount} chương
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {story.viewCount.toLocaleString("vi-VN")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" asChild>
                          <Link href={`/client/stories/${story.slug}/1`}>
                            Đọc
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Bạn chưa đánh dấu truyện nào
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Lịch sử đọc
              </CardTitle>
              <CardDescription>Các truyện bạn đã đọc gần đây</CardDescription>
            </CardHeader>
            <CardContent>
              {mockHistory.length > 0 ? (
                <div className="space-y-4">
                  {mockHistory.map((story) => (
                    <div
                      key={story.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <img
                        src={
                          story.coverUrl ||
                          `/placeholder.svg?height=80&width=60&query=${story.title} cover`
                        }
                        alt={story.title}
                        className="w-14 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/client/stories/${story.slug}`}
                          className="font-medium hover:text-primary line-clamp-1"
                        >
                          {story.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Đọc đến: Chương {story.lastChapter}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          {new Date(story.lastReadAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" asChild>
                          <Link
                            href={`/client/stories/${story.slug}/${story.lastChapter}`}
                          >
                            Đọc tiếp
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Bạn chưa đọc truyện nào
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid gap-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Thông tin cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên hiển thị</Label>
                    <Input id="name" defaultValue={mockUser.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={mockUser.email}
                    />
                  </div>
                </div>
                <Button>Lưu thay đổi</Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Thông báo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Thông báo chương mới</p>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo khi truyện đánh dấu có chương mới
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email cập nhật</p>
                    <p className="text-sm text-muted-foreground">
                      Nhận email tổng hợp hàng tuần
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">
                  Vùng nguy hiểm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive">Xóa tài khoản</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
