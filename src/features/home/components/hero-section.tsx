import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

export function HeroSection() {
  return (
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
  );
}
