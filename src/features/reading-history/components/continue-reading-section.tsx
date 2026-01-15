"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, PlayCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import type { ReadingHistoryItem } from "@/features/reading-history/server";

interface ContinueReadingSectionProps {
  items: ReadingHistoryItem[];
}

export function ContinueReadingSection({ items }: ContinueReadingSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <PlayCircle className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold">Tiếp tục đọc</h2>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/client/profile?tab=history">Xem tất cả</Link>
          </Button>
        </div>

        {/* Horizontal scroll cards */}
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {items.map((item) => (
            <Card
              key={item.id}
              className="flex-shrink-0 w-[280px] md:w-[320px] overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-0">
                <div className="flex gap-3 p-3">
                  {/* Cover image */}
                  <Link
                    href={`/client/stories/${item.story.slug}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.story.cover_image_url || "/placeholder.svg"}
                      alt={item.story.title}
                      className="w-16 h-24 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/client/stories/${item.story.slug}`}
                        className="font-medium hover:text-primary line-clamp-2 text-sm"
                      >
                        {item.story.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        Chương {item.chapter.chapter_number}
                        {item.chapter.title && `: ${item.chapter.title}`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(item.last_read_at)}
                      </div>
                      <Button size="sm" variant="secondary" asChild>
                        <Link
                          href={`/client/stories/${item.story.slug}/${item.chapter.chapter_number}`}
                        >
                          Đọc tiếp
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}
