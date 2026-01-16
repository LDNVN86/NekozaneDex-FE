"use server";

import { revalidatePath } from "next/cache";
import {
  createComment,
  replyToComment,
  deleteComment,
  updateComment,
  togglePinComment,
  reportComment,
  getStoryComments,
} from "../server";
import type { Comment } from "../server";

export async function loadMoreCommentsAction(
  storyId: string,
  page: number,
  limit = 10,
): Promise<{
  success: boolean;
  comments?: Comment[];
  hasMore?: boolean;
  totalPages?: number;
  error?: string;
}> {
  const result = await getStoryComments(storyId, page, limit);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  const { data, meta } = result.data;
  const hasMore = meta.page < meta.total_pages;

  return {
    success: true,
    comments: data,
    hasMore,
    totalPages: meta.total_pages,
  };
}

export async function createCommentAction(
  storyId: string,
  storySlug: string,
  content: string,
  chapterId?: string,
): Promise<{ success: boolean; error?: string; comment?: Comment }> {
  if (!content.trim()) {
    return { success: false, error: "Nội dung không được để trống" };
  }

  if (content.length > 2000) {
    return { success: false, error: "Nội dung tối đa 2000 ký tự" };
  }

  const result = await createComment(storyId, content.trim(), chapterId);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(`/client/stories/${storySlug}`);
  return { success: true, comment: result.data };
}

export async function replyCommentAction(
  parentId: string,
  storySlug: string,
  content: string,
): Promise<{ success: boolean; error?: string; reply?: Comment }> {
  if (!content.trim()) {
    return { success: false, error: "Nội dung không được để trống" };
  }

  if (content.length > 2000) {
    return { success: false, error: "Nội dung tối đa 2000 ký tự" };
  }

  const result = await replyToComment(parentId, content.trim());

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(`/client/stories/${storySlug}`);
  return { success: true, reply: result.data };
}

export async function updateCommentAction(
  commentId: string,
  storySlug: string,
  content: string,
): Promise<{ success: boolean; error?: string; comment?: Comment }> {
  if (!content.trim()) {
    return { success: false, error: "Nội dung không được để trống" };
  }

  if (content.length > 2000) {
    return { success: false, error: "Nội dung tối đa 2000 ký tự" };
  }

  const result = await updateComment(commentId, content.trim());

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(`/client/stories/${storySlug}`);
  return { success: true, comment: result.data };
}

export async function deleteCommentAction(
  commentId: string,
  storySlug: string,
): Promise<{ success: boolean; error?: string }> {
  const result = await deleteComment(commentId);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(`/client/stories/${storySlug}`);
  return { success: true };
}

export async function togglePinCommentAction(
  commentId: string,
  storySlug: string,
): Promise<{ success: boolean; error?: string; is_pinned?: boolean }> {
  const result = await togglePinComment(commentId);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(`/client/stories/${storySlug}`);
  return { success: true, is_pinned: result.data.is_pinned };
}

export async function reportCommentAction(
  commentId: string,
  reason: string,
): Promise<{ success: boolean; error?: string }> {
  if (!reason.trim()) {
    return { success: false, error: "Lý do không được để trống" };
  }

  const result = await reportComment(commentId, reason.trim());

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true };
}
