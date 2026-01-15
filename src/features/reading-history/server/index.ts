import "server-only";
import { withAuthFetch, serverFetch } from "@/shared/lib/api";
import type { Result } from "@/shared/lib/result";

export interface ReadingHistoryItem {
  id: string;
  user_id: string;
  story_id: string;
  chapter_id: string;
  last_read_at: string;
  scroll_position: number;
  story: {
    id: string;
    title: string;
    slug: string;
    cover_image_url: string | null;
  };
  chapter: {
    id: string;
    title: string;
    chapter_number: number;
  };
}

interface PaginatedHistory {
  data: ReadingHistoryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

/**
 * Get user's reading history (paginated)
 */
export async function getReadingHistory(
  page = 1,
  limit = 20
): Promise<Result<PaginatedHistory>> {
  return withAuthFetch(
    (headers) =>
      serverFetch<PaginatedHistory>(
        `/reading-history?page=${page}&limit=${limit}`,
        { headers }
      ),
    "Không thể lấy lịch sử đọc"
  );
}

/**
 * Get "Continue Reading" items for home page
 */
export async function getContinueReading(
  limit = 6
): Promise<Result<ReadingHistoryItem[]>> {
  return withAuthFetch(
    (headers) =>
      serverFetch<{ data: ReadingHistoryItem[] }>(
        `/reading-history/continue?limit=${limit}`,
        { headers }
      ).then((res) => res.data ?? res),
    "Không thể lấy danh sách tiếp tục đọc"
  );
}

/**
 * Get reading progress for a specific story
 */
export async function getStoryProgress(
  storyId: string
): Promise<Result<ReadingHistoryItem | null>> {
  return withAuthFetch(
    (headers) =>
      serverFetch<{ data: ReadingHistoryItem | null }>(
        `/reading-history/story/${storyId}`,
        { headers }
      ).then((res) => res.data ?? null),
    "Không thể lấy tiến độ đọc"
  );
}

/**
 * Save reading progress (called from chapter page)
 */
export async function saveReadingProgress(
  storyId: string,
  chapterId: string,
  scrollPosition = 0
): Promise<Result<{ message: string }>> {
  return withAuthFetch(
    (headers) =>
      serverFetch<{ data: { message: string } }>("/reading-history", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          story_id: storyId,
          chapter_id: chapterId,
          scroll_position: scrollPosition,
        }),
      }).then((res) => res.data),
    "Không thể lưu tiến độ đọc"
  );
}

/**
 * Delete a story from reading history
 */
export async function deleteFromHistory(
  storyId: string
): Promise<Result<{ message: string }>> {
  return withAuthFetch(
    (headers) =>
      serverFetch<{ data: { message: string } }>(
        `/reading-history/${storyId}`,
        {
          method: "DELETE",
          headers,
        }
      ).then((res) => res.data),
    "Không thể xóa khỏi lịch sử"
  );
}

/**
 * Clear all reading history
 */
export async function clearAllHistory(): Promise<Result<{ message: string }>> {
  return withAuthFetch(
    (headers) =>
      serverFetch<{ data: { message: string } }>("/reading-history", {
        method: "DELETE",
        headers,
      }).then((res) => res.data),
    "Không thể xóa lịch sử"
  );
}
