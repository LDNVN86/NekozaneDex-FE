"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpDown, Clock, BookOpen } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import type { Chapter } from "@/features/story";

interface ChapterListProps {
  storySlug: string;
  chapters: Chapter[];
}

export function ChapterList({ storySlug, chapters }: ChapterListProps) {
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const sortedChapters = React.useMemo(() => {
    return [...chapters].sort((a, b) =>
      sortOrder === "desc"
        ? b.chapter_number - a.chapter_number
        : a.chapter_number - b.chapter_number
    );
  }, [chapters, sortOrder]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          Danh sách chương ({chapters.length})
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder((o) => (o === "desc" ? "asc" : "desc"))}
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          {sortOrder === "desc" ? "Mới nhất" : "Cũ nhất"}
        </Button>
      </div>

      {chapters.length > 0 ? (
        <div className="border rounded-xl overflow-hidden">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                    Chương
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                    Tiêu đề
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                    Ngày đăng
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedChapters.map((chapter, index) => (
                  <tr
                    key={chapter.id}
                    className={cn(
                      "border-t hover:bg-muted/30 transition-colors",
                      index % 2 === 0 && "bg-muted/10"
                    )}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/client/stories/${storySlug}/${chapter.chapter_number}`}
                        className="text-primary hover:underline font-medium"
                      >
                        Chương {chapter.chapter_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Link
                        href={`/client/stories/${storySlug}/${chapter.chapter_number}`}
                        className="text-foreground hover:text-primary"
                      >
                        {chapter.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(chapter.published_at || chapter.created_at)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border rounded-xl">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Chưa có chương nào được đăng</p>
        </div>
      )}
    </section>
  );
}
