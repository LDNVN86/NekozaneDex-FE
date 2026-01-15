import { getNotifications, getUnreadCount } from "../server";
import { NotificationBell } from "./notification-bell";
import { getAuthFromCookie } from "@/features/auth/server";

/**
 * Server component wrapper for notification bell
 * Fetches data on server and passes to client component
 */
export async function NotificationBellServer() {
  const [notificationsResult, unreadResult, userResult] = await Promise.all([
    getNotifications(1, 10),
    getUnreadCount(),
    getAuthFromCookie(),
  ]);

  const notifications = notificationsResult.success
    ? notificationsResult.data.data
    : [];
  const unreadCount = unreadResult.success ? unreadResult.data : 0;
  const currentUserId = userResult.success ? userResult.data.id : undefined;

  return (
    <NotificationBell
      notifications={notifications}
      unreadCount={unreadCount}
      currentUserId={currentUserId}
    />
  );
}
