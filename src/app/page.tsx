import Link from "next/link";
import { ArrowRight, Flame, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { StoryCard } from "@/features/story/components/story-card";
import { genres } from "@/features/story/data/mock-data";
import { getHotStories, getLatestStories, type Story } from "@/features/story";

export default async function HomePage() {
  const [latestRes, hotRes] = await Promise.all([
    getLatestStories(6),
    getHotStories(4),
  ]);

  const newStories = latestRes.success ? latestRes.data : [];
  const hotStories = hotRes.success ? hotRes.data : [];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Nền tảng đọc truyện hàng đầu
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
              Khám phá thế giới{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                tiểu thuyết
              </span>{" "}
              đỉnh cao
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
              Hàng ngàn bộ truyện chất lượng cao, cập nhật liên tục. Trải nghiệm
              đọc truyện mượt mà với giao diện hiện đại.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/client/stories">
                  Khám phá ngay
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/client/rankings">Xem bảng xếp hạng</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-accent/20 rounded-full blur-3xl -z-10" />
      </section>

      {/* New Updates Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Truyện Mới Cập Nhật</h2>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/client/stories" className="gap-1">
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {newStories.map((story: Story) => (
              <StoryCard
                key={story.id}
                id={story.id}
                title={story.title}
                slug={story.slug}
                coverUrl={story.cover_image_url}
                viewCount={story.view_count}
                chapterCount={story.total_chapters}
                isHot={story.view_count > 1000}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Hot Stories Section */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <Flame className="h-5 w-5 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold">Truyện Hot</h2>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/client/rankings" className="gap-1">
                Xem bảng xếp hạng
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {hotStories.map((story: Story) => (
              <StoryCard
                key={story.id}
                id={story.id}
                title={story.title}
                slug={story.slug}
                coverUrl={story.cover_image_url}
                viewCount={story.view_count}
                chapterCount={story.total_chapters}
                isHot={story.view_count > 1000}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Thể Loại</h2>
            <Button variant="ghost" asChild>
              <Link href="/client/genres" className="gap-1">
                Tất cả thể loại
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {genres.map((genre) => (
              <Link key={genre.id} href={`/client/stories?genre=${genre.id}`}>
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {genre.name}
                  <span className="ml-2 text-muted-foreground">
                    ({genre.count})
                  </span>
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Nekozanedex
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2026 Nekozanedex. Nền tảng đọc truyện online hàng đầu.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/client/about"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Giới thiệu
              </Link>
              <Link
                href="/client/contact"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Liên hệ
              </Link>
              <Link
                href="/client/terms"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Điều khoản
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
