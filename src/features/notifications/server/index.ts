import "server-only";
import { serverFetch, withAuthFetch } from "@/shared/lib/api";
import type { Result } from "@/shared/lib/result";

// Types
export interface Notification {
  id: string;
  user_id: string;
  type: string; // new_chapter, reply, system, etc.
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

interface PaginatedNotifications {
  data: Notification[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

/**
 * Get user's notifications (paginated)
 */
export async function getNotifications(
  page = 1,
  limit = 20
): Promise<Result<PaginatedNotifications>> {
  return withAuthFetch(
    (headers) =>
      serverFetch<PaginatedNotifications>(
        `/notifications?page=${page}&limit=${limit}`,
        { headers }
      ),
    "Không thể lấy thông báo"
  );
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<Result<number>> {
  return withAuthFetch(async (headers) => {
    const res = await serverFetch<{ data: { unread_count: number } }>(
      `/notifications/unread-count`,
      { headers }
    );
    return res.data.unread_count;
  }, "Không thể lấy số thông báo chưa đọc");
}

/**
 * Mark single notification as read
 */
export async function markAsRead(
  notificationId: string
): Promise<Result<void>> {
  return withAuthFetch(async (headers) => {
    await serverFetch(`/notifications/${notificationId}/read`, {
      method: "POST",
      headers,
    });
  }, "Không thể đánh dấu đã đọc");
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<Result<void>> {
  return withAuthFetch(async (headers) => {
    await serverFetch(`/notifications/read-all`, {
      method: "POST",
      headers,
    });
  }, "Không thể đánh dấu tất cả đã đọc");
}
