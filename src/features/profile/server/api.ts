import "server-only";
import { cookies } from "next/headers";
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
// Helper
// ============================================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

async function authFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<Result<T>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return err("Chưa đăng nhập");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return err(errorData?.error || `API Error: ${res.status}`);
    }

    const data = await res.json();
    return ok(data);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Network error");
  }
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
  return authFetch<BookmarksResponse>(`bookmarks?page=${page}&limit=${limit}`);
}

/**
 * Check if a story is bookmarked
 */
export async function checkBookmark(
  storyId: string
): Promise<Result<{ is_bookmarked: boolean }>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return ok({ is_bookmarked: false });
  }

  return authFetch<{ is_bookmarked: boolean }>(`bookmarks/${storyId}/check`);
}

/**
 * Add a story to bookmarks
 */
export async function addBookmark(
  storyId: string
): Promise<Result<{ message: string }>> {
  return authFetch<{ message: string }>(`bookmarks/${storyId}`, {
    method: "POST",
  });
}

/**
 * Remove a story from bookmarks
 */
export async function removeBookmark(
  storyId: string
): Promise<Result<{ message: string }>> {
  return authFetch<{ message: string }>(`bookmarks/${storyId}`, {
    method: "DELETE",
  });
}
