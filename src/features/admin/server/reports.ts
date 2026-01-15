import { serverFetch, withAuthFetch } from "@/shared/lib/api";
import type { Result } from "@/shared/lib/result";
import type { Comment } from "@/features/comments/server";

export interface CommentReport {
  id: string;
  comment_id: string;
  user_id: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  created_at: string;
  updated_at: string;
  comment?: Comment;
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface GetReportsParams {
  page?: number;
  limit?: number;
  status?: string;
}

/**
 * Get all comment reports (Admin only)
 */
export async function getCommentReports(
  params: GetReportsParams = {}
): Promise<Result<{ data: CommentReport[]; total: number }>> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.status) query.append("status", params.status);

  return withAuthFetch(async (headers) => {
    const res = await serverFetch<{ data: CommentReport[]; total: number }>(
      `/admin/comments/reports?${query.toString()}`,
      {
        headers,
      }
    );
    return res;
  }, "Không thể lấy danh sách báo cáo");
}

/**
 * Resolve or dismiss a comment report (Admin only)
 */
export async function resolveCommentReport(
  reportId: string,
  status: "resolved" | "dismissed"
): Promise<Result<void>> {
  return withAuthFetch(async (headers) => {
    await serverFetch<void>(`/admin/comments/reports/${reportId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ status }),
    });
  }, "Không thể xử lý báo cáo");
}
