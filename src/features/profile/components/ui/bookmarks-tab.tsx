"use client";

import Link from "next/link";
import { Heart, BookOpen, Eye, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { toast } from "sonner";
import type { BookmarkItem } from "@/features/profile/interfaces";

interface BookmarksTabProps {
  bookmarks: BookmarkItem[];
}

export function BookmarksTab({ bookmarks }: BookmarksTabProps) {
  const handleRemoveBookmark = async (storyId: string, storyTitle: string) => {
    // TODO: Implement with server action when revalidation is set up
    toast.info(`Xóa bookmark: ${storyTitle}`, {
      description: "Tính năng đang được phát triển",
    });
  };

  return (
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
        {bookmarks.length > 0 ? (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <img
                  src={bookmark.story.cover_image_url || "/placeholder.svg"}
                  alt={bookmark.story.title}
                  className="w-14 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/client/stories/${bookmark.story.slug}`}
                    className="font-medium hover:text-primary line-clamp-1"
                  >
                    {bookmark.story.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {bookmark.story.author_name}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {bookmark.story.total_chapters} chương
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {bookmark.story.view_count.toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" asChild>
                    <Link href={`/client/stories/${bookmark.story.slug}/1`}>
                      Đọc
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() =>
                      handleRemoveBookmark(
                        bookmark.story_id,
                        bookmark.story.title
                      )
                    }
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
  );
}
