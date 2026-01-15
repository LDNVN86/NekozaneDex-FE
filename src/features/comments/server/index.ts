import "server-only";
import { serverFetch, withAuthFetch } from "@/shared/lib/api";
import type { Result } from "@/shared/lib/result";

// Types
export interface CommentUser {
  id: string;
  username: string;
  tag_name?: string;
  avatar_url?: string;
}

export interface Comment {
  id: string;
  user_id: string;
  story_id: string;
  chapter_id?: string;
  parent_id?: string;
  content: string;
  is_approved: boolean;
  is_pinned?: boolean;
  like_count: number;
  user_has_liked?: boolean;
  created_at: string;
  updated_at: string;
  user: CommentUser;
  replies?: Comment[];
}

interface PaginatedComments {
  data: Comment[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

/**
 * Get comments for a story (paginated)
 */
export async function getStoryComments(
  storyId: string,
  page = 1,
  limit = 20
): Promise<Result<PaginatedComments>> {
  try {
    const { getAuthHeaders } = await import("@/shared/lib/server-auth");
    const headers = await getAuthHeaders();
    const data = await serverFetch<PaginatedComments>(
      `/comments/story/${storyId}?page=${page}&limit=${limit}`,
      { headers }
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể lấy comments",
    };
  }
}

/**
 * Get comments for a chapter
 */
export async function getChapterComments(
  chapterId: string,
  page = 1,
  limit = 20
): Promise<Result<PaginatedComments>> {
  try {
    const { getAuthHeaders } = await import("@/shared/lib/server-auth");
    const headers = await getAuthHeaders();
    const data = await serverFetch<PaginatedComments>(
      `/chapters/${chapterId}/comments?page=${page}&limit=${limit}`,
      { headers }
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể lấy comments",
    };
  }
}

/**
 * Create a comment on a story
 */
export async function createComment(
  storyId: string,
  content: string,
  chapterId?: string
): Promise<Result<Comment>> {
  return withAuthFetch(async (headers) => {
    const body: { content: string; chapter_id?: string } = { content };
    if (chapterId) body.chapter_id = chapterId;

    const res = await serverFetch<{ data: Comment }>(
      `/stories/${storyId}/comments`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    );
    return res.data;
  }, "Không thể tạo comment");
}

/**
 * Reply to a comment
 */
export async function replyToComment(
  parentId: string,
  content: string
): Promise<Result<Comment>> {
  return withAuthFetch(async (headers) => {
    const res = await serverFetch<{ data: Comment }>(
      `/comments/${parentId}/reply`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ content }),
      }
    );
    return res.data;
  }, "Không thể trả lời comment");
}

/**
 * Delete a comment (owner or admin)
 */
export async function deleteComment(commentId: string): Promise<Result<void>> {
  return withAuthFetch(async (headers) => {
    await serverFetch(`/comments/${commentId}`, {
      method: "DELETE",
      headers,
    });
  }, "Không thể xóa comment");
}

/**
 * Update a comment (owner only)
 */
export async function updateComment(
  commentId: string,
  content: string
): Promise<Result<Comment>> {
  return withAuthFetch(async (headers) => {
    const res = await serverFetch<{ data: Comment }>(`/comments/${commentId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ content }),
    });
    return res.data;
  }, "Không thể cập nhật comment");
}

/**
 * Pin or Unpin a comment (Admin only)
 */
export async function togglePinComment(
  commentId: string
): Promise<Result<{ is_pinned: boolean }>> {
  return withAuthFetch(async (headers) => {
    const res = await serverFetch<{ data: { is_pinned: boolean } }>(
      `/comments/${commentId}/pin`,
      {
        method: "POST",
        headers,
      }
    );
    return res.data;
  }, "Không thể ghim bình luận");
}

/**
 * Report a comment
 */
export async function reportComment(
  commentId: string,
  reason: string
): Promise<Result<void>> {
  return withAuthFetch(async (headers) => {
    await serverFetch(`/comments/${commentId}/report`, {
      method: "POST",
      headers,
      body: JSON.stringify({ reason }),
    });
  }, "Không thể báo cáo bình luận");
}
