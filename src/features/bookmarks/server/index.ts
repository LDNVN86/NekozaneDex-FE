import "server-only";
import { serverFetch, withAuthFetch } from "@/shared/lib/api";
import type { Result } from "@/shared/lib/result";
import type { Story } from "@/features/story";

// Types
export interface Bookmark {
  id: string;
  user_id: string;
  story_id: string;
  created_at: string;
  story: Story;
}

export interface BookmarkCheckResponse {
  is_bookmarked: boolean;
}

interface PaginatedBookmarks {
  data: Bookmark[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

/**
 * Get user's bookmarks (paginated)
 */
export async function getBookmarks(
  page = 1,
  limit = 20
): Promise<Result<PaginatedBookmarks>> {
  return withAuthFetch(
    (headers) =>
      serverFetch<PaginatedBookmarks>(
        `/bookmarks?page=${page}&limit=${limit}`,
        { headers }
      ),
    "Không thể lấy danh sách bookmark"
  );
}

/**
 * Check if user has bookmarked a story
 */
export async function checkBookmark(storyId: string): Promise<Result<boolean>> {
  return withAuthFetch(async (headers) => {
    const res = await serverFetch<{ data: BookmarkCheckResponse }>(
      `/bookmarks/${storyId}/check`,
      { headers }
    );
    return res.data.is_bookmarked;
  }, "Không thể kiểm tra bookmark");
}

/**
 * Add bookmark
 */
export async function addBookmark(
  storyId: string
): Promise<Result<{ message: string }>> {
  return withAuthFetch(async (headers) => {
    const res = await serverFetch<{ data: { message: string } }>(
      `/bookmarks/${storyId}`,
      {
        method: "POST",
        headers,
      }
    );
    return res.data;
  }, "Không thể thêm bookmark");
}

/**
 * Remove bookmark
 */
export async function removeBookmark(
  storyId: string
): Promise<Result<{ message: string }>> {
  return withAuthFetch(async (headers) => {
    const res = await serverFetch<{ data: { message: string } }>(
      `/bookmarks/${storyId}`,
      {
        method: "DELETE",
        headers,
      }
    );
    return res.data;
  }, "Không thể xóa bookmark");
}
