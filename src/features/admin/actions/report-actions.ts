"use server";

import { revalidatePath } from "next/cache";
import { resolveCommentReport } from "../server/reports";
import { deleteComment } from "@/features/comments/server";

/**
 * Resolve or dismiss a comment report
 */
export async function resolveCommentReportAction(
  reportId: string,
  status: "resolved" | "dismissed"
): Promise<{ success: boolean; error?: string }> {
  const result = await resolveCommentReport(reportId, status);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/server/admin/comment-reports");
  return { success: true };
}

/**
 * Delete a reported comment and mark report as resolved
 */
export async function adminDeleteReportedCommentAction(
  reportId: string,
  commentId: string
): Promise<{ success: boolean; error?: string }> {
  // 1. Delete the comment
  const deleteResult = await deleteComment(commentId);
  if (!deleteResult.success) {
    return { success: false, error: deleteResult.error };
  }

  // 2. Mark report as resolved
  const resolveResult = await resolveCommentReport(reportId, "resolved");
  if (!resolveResult.success) {
    return { success: false, error: resolveResult.error };
  }

  revalidatePath("/server/admin/comment-reports");
  return { success: true };
}
