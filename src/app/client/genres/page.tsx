import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { genres } from "@/features/story/data/mock-data";

export default function GenresPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Thể Loại Truyện</h1>
        <p className="text-muted-foreground mt-2">
          Khám phá truyện theo thể loại yêu thích của bạn
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {genres.map((genre) => (
          <Link key={genre.id} href={`/client/stories?genre=${genre.id}`}>
            <Card className="group hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {genre.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {genre.count} truyện
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
