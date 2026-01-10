import type { Chapter } from "@/features/story";

interface ChapterContentProps {
  chapter: Chapter;
  zoom: number;
}

export function ChapterContent({ chapter, zoom }: ChapterContentProps) {
  return (
    <article className="container mx-auto py-4">
      <div
        className="mx-auto flex flex-col items-center gap-1 transition-all duration-300"
        style={{ width: `${zoom}%`, maxWidth: "100%" }}
      >
        {/* Chapter Title */}
        <h1 className="text-xl font-bold mb-6 text-center">
          Chương {chapter.chapter_number}: {chapter.title}
        </h1>

        {/* Chapter Images */}
        {chapter.images && chapter.images.length > 0 ? (
          chapter.images.map((imageUrl, index) => (
            <div key={index} className="relative w-full max-w-4xl bg-muted/20">
              <img
                src={imageUrl}
                alt={`Trang ${index + 1}`}
                className="w-full h-auto block"
                loading={index < 3 ? "eager" : "lazy"}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              Chương này chưa có nội dung.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
