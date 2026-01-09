"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Eye,
  BookOpen,
  Heart,
  ArrowUpDown,
  Clock,
  User,
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Textarea } from "@/shared/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";
import { mockStories, mockChapters } from "@/features/story/data/mock-data";
import { cn } from "@/shared/lib/utils";

export default function StoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [synopsisOpen, setSynopsisOpen] = React.useState(true);
  const [comment, setComment] = React.useState("");

  // Find story by slug
  const story = mockStories.find((s) => s.slug === slug) || mockStories[0];

  const sortedChapters = [...mockChapters].sort((a, b) =>
    sortOrder === "desc" ? b.number - a.number : a.number - b.number
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Story Header */}
      <div className="flex flex-col lg:flex-row gap-8 mb-10">
        {/* Cover Image */}
        <div className="shrink-0">
          <div className="relative w-full max-w-[280px] mx-auto lg:mx-0 aspect-[3/4] rounded-xl overflow-hidden shadow-xl">
            <img
              src={
                story.coverUrl ||
                `/placeholder.svg?height=400&width=300&query=${
                  encodeURIComponent(story.title + " novel cover") ||
                  "/placeholder.svg"
                }`
              }
              alt={story.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Story Info */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-balance">
              {story.title}
            </h1>
            <div className="flex items-center gap-2 mt-3 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{story.author}</span>
            </div>
          </div>

          {/* Status & Stats */}
          <div className="flex flex-wrap items-center gap-4">
            <Badge
              variant={story.status === "completed" ? "default" : "secondary"}
              className="text-sm px-3 py-1"
            >
              {story.status === "completed" ? "Hoàn thành" : "Đang ra"}
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{story.viewCount.toLocaleString("vi-VN")} lượt đọc</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{story.chapterCount} chương</span>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {story.genres.map((genre) => (
              <Link
                key={genre}
                href={`/client/stories?genre=${genre
                  .toLowerCase()
                  .replace(/ /g, "-")}`}
              >
                <Badge
                  variant="outline"
                  className="hover:bg-secondary transition-colors cursor-pointer"
                >
                  {genre}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Synopsis */}
          <Collapsible open={synopsisOpen} onOpenChange={setSynopsisOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between px-0 hover:bg-transparent"
              >
                <span className="font-semibold">Giới thiệu</span>
                {synopsisOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <p className="text-muted-foreground leading-relaxed">
                {story.synopsis}
              </p>
            </CollapsibleContent>
          </Collapsible>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <Button size="lg" asChild>
              <Link href={`/client/stories/${slug}/1`}>
                <BookOpen className="h-5 w-5 mr-2" />
                Đọc từ đầu
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link
                href={`/client/stories/${slug}/${Math.min(
                  10,
                  story.chapterCount
                )}`}
              >
                Đọc tiếp
              </Link>
            </Button>
            <Button
              size="lg"
              variant={isBookmarked ? "default" : "outline"}
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={cn(
                isBookmarked &&
                  "bg-pink-500 hover:bg-pink-600 border-pink-500 text-white"
              )}
            >
              <Heart
                className={cn("h-5 w-5 mr-2", isBookmarked && "fill-current")}
              />
              {isBookmarked ? "Đã đánh dấu" : "Đánh dấu"}
            </Button>
          </div>
        </div>
      </div>

      {/* Chapters Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Danh sách chương</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder((o) => (o === "desc" ? "asc" : "desc"))}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === "desc" ? "Mới nhất" : "Cũ nhất"}
          </Button>
        </div>

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
                        href={`/client/stories/${slug}/${chapter.number}`}
                        className="text-primary hover:underline font-medium"
                      >
                        Chương {chapter.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Link
                        href={`/client/stories/${slug}/${chapter.number}`}
                        className="text-foreground hover:text-primary"
                      >
                        {chapter.title.split(": ")[1]}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(chapter.publishedAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="h-5 w-5" />
          <h2 className="text-xl font-bold">Bình luận (24)</h2>
        </div>

        {/* Comment Form */}
        <div className="flex gap-4 mb-8">
          <Avatar className="shrink-0">
            <AvatarImage src="/diverse-user-avatars.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Viết bình luận của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <Button disabled={!comment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Gửi bình luận
            </Button>
          </div>
        </div>

        {/* Comment List */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Avatar className="shrink-0">
                <AvatarImage
                  src={`/online-commenter.png?height=40&width=40&query=commenter ${i} avatar`}
                />
                <AvatarFallback>U{i}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">Người dùng {i}</span>
                  <span className="text-xs text-muted-foreground">
                    {i} ngày trước
                  </span>
                </div>
                <p className="text-muted-foreground">
                  Truyện hay quá, cảm ơn tác giả đã viết nên một tác phẩm tuyệt
                  vời như vậy. Mong sớm có chương mới!
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
