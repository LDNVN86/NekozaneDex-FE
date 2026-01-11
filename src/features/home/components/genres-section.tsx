import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import type { Genre } from "@/features/story/interface/story-interface";

interface GenresSectionProps {
  genres: Genre[];
}

export function GenresSection({ genres }: GenresSectionProps) {
  return (
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
          {genres.slice(0, 12).map((genre) => (
            <Link key={genre.id} href={`/client/stories?genre=${genre.slug}`}>
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {genre.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
