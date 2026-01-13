import "server-only";
import { authFetch, getAccessToken } from "@/shared/lib/server-auth";
import { type Result, ok, err } from "@/response/response";
import type { Story } from "@/features/story/interface/story-interface";

// ============================================================================
// Types
// ============================================================================

export interface Bookmark {
  id: string;
  user_id: string;
  story_id: string;
  created_at: string;
  story: Story;
}

export interface BookmarksResponse {
  data: Bookmark[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// ============================================================================
// Server API Functions
// ============================================================================

/**
 * Get user's bookmarks with pagination
 */
export async function getMyBookmarks(
  page = 1,
  limit = 20
): Promise<Result<BookmarksResponse>> {
  const result = await authFetch<BookmarksResponse>(
    `bookmarks?page=${page}&limit=${limit}`
  );

  if (result.success) {
    return ok(result.data);
  }
  return err(result.error);
}

/**
 * Check if a story is bookmarked
 */
export async function checkBookmark(
  storyId: string
): Promise<Result<{ is_bookmarked: boolean }>> {
  const token = await getAccessToken();

  // Not logged in = not bookmarked
  if (!token) {
    return ok({ is_bookmarked: false });
  }

  const result = await authFetch<{ is_bookmarked: boolean }>(
    `bookmarks/${storyId}/check`
  );

  if (result.success) {
    return ok(result.data);
  }
  return err(result.error);
}

/**
 * Add a story to bookmarks
 */
export async function addBookmark(
  storyId: string
): Promise<Result<{ message: string }>> {
  const result = await authFetch<{ message: string }>(`bookmarks/${storyId}`, {
    method: "POST",
  });

  if (result.success) {
    return ok(result.data);
  }
  return err(result.error);
}

/**
 * Remove a story from bookmarks
 */
export async function removeBookmark(
  storyId: string
): Promise<Result<{ message: string }>> {
  const result = await authFetch<{ message: string }>(`bookmarks/${storyId}`, {
    method: "DELETE",
  });

  if (result.success) {
    return ok(result.data);
  }
  return err(result.error);
}
