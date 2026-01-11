"use client";

import Link from "next/link";
import { History, Clock, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import type { HistoryItem } from "@/features/profile/interfaces";

interface HistoryTabProps {
  history: HistoryItem[];
}

export function HistoryTab({ history }: HistoryTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Lịch sử đọc
        </CardTitle>
        <CardDescription>Các truyện bạn đã đọc gần đây</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <img
                  src={item.story.cover_image_url || "/placeholder.svg"}
                  alt={item.story.title}
                  className="w-14 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/client/stories/${item.story.slug}`}
                    className="font-medium hover:text-primary line-clamp-1"
                  >
                    {item.story.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Đọc đến: Chương {item.chapter_number}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    {new Date(item.last_read_at).toLocaleDateString("vi-VN")}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" asChild>
                    <Link
                      href={`/client/stories/${item.story.slug}/${item.chapter_number}`}
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
  );
}
