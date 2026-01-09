export const mockStories = [
  {
    id: "1",
    title: "Đấu La Đại Lục (Manga)",
    slug: "dau-la-dai-luc",
    coverUrl: "@/public/fantasy-martial-arts-novel-cover.jpg",
    chapterCount: 1256,
    viewCount: 2500000,
    status: "completed" as const,
    isHot: true,
    author: "Đường Gia Tam Thiếu",
    genres: ["Action", "Adventure", "Fantasy"],
    synopsis:
      "Đường Tam, một thiên tài vô song trong giới đường môn... (Phiên bản Manga với hình ảnh sắc nét)",
  },
];

export const mockMangaPages = [
  "@/public/manga-page-1.png",
  "@/public/manga-page-2.png",
  "@/public/manga-page-3.png",
  "@/public/manga-page-4.png",
  "@/public/manga-page-5.png",
];

export const genres = [{ id: "tien-hiep", name: "Tiên Hiệp", count: 1250 }];

export const mockChapters = Array.from({ length: 50 }, (_, i) => ({
  id: `ch-${i + 1}`,
  number: i + 1,
  title: `Chương ${i + 1}: ${
    ["Khởi đầu mới", "Cơ duyên kỳ lạ", "Bước ngoặt", "Đột phá", "Chiến đấu"][
      i % 5
    ]
  }`,
  publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
}));
