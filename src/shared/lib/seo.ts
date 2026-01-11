import type { Metadata } from "next";

export const SITE_NAME = "Nekozanedex";
export const SITE_DESCRIPTION =
  "Nền tảng đọc truyện online hàng đầu với hàng ngàn bộ truyện chất lượng cao";
export const DEFAULT_OG_IMAGE = "/og-image.png";

export interface SeoOptions {
  title: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonical?: string;
}

//Format page title with site name suffix
export function formatTitle(title: string): string {
  return `${title} | ${SITE_NAME}`;
}

//Create basic metadata object
export function createMetadata({
  title,
  description,
  image,
  noIndex,
  canonical,
}: SeoOptions): Metadata {
  const formattedTitle = formatTitle(title);
  const desc = description || SITE_DESCRIPTION;

  return {
    title: formattedTitle,
    description: desc,
    openGraph: {
      title: formattedTitle,
      description: desc,
      siteName: SITE_NAME,
      images: image ? [image] : [DEFAULT_OG_IMAGE],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description: desc,
      images: image ? [image] : [DEFAULT_OG_IMAGE],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
    ...(canonical && {
      alternates: { canonical },
    }),
  };
}

//Create metadata for story pages
export function createStoryMetadata(
  storyTitle: string,
  options?: {
    description?: string;
    coverImage?: string;
    chapterTitle?: string;
    chapterNumber?: number;
  }
): Metadata {
  const { description, coverImage, chapterTitle, chapterNumber } =
    options || {};

  // Build title based on whether it's a chapter or story page
  const title = chapterTitle ? `${chapterTitle} - ${storyTitle}` : storyTitle;

  // Build description
  const desc = chapterNumber
    ? `Đọc chương ${chapterNumber} của truyện ${storyTitle} tại ${SITE_NAME}`
    : description || `Đọc truyện ${storyTitle} tại ${SITE_NAME}`;

  return createMetadata({
    title,
    description: desc,
    image: coverImage,
  });
}

//Create metadata for search pages
export function createSearchMetadata(query?: string): Metadata {
  if (query) {
    return createMetadata({
      title: `Tìm kiếm: ${query}`,
      description: `Kết quả tìm kiếm cho "${query}" - Đọc truyện tranh online miễn phí`,
    });
  }

  return createMetadata({
    title: "Tìm Kiếm Truyện",
    description:
      "Tìm kiếm truyện tranh theo tên, tác giả, thể loại - Đọc truyện online miễn phí",
  });
}

//Create 404/not found metadata
export function createNotFoundMetadata(type: "story" | "chapter"): Metadata {
  const title =
    type === "story" ? "Truyện không tồn tại" : "Chapter không tồn tại";
  return createMetadata({
    title,
    description: `${
      type === "story" ? "Truyện" : "Chapter"
    } bạn tìm kiếm không tồn tại hoặc đã bị xóa.`,
    noIndex: true,
  });
}
