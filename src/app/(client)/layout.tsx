import { Header } from "@/shared/components/header";
import { getAuthFromCookie } from "@/features/auth/server";
import {
  getNotifications,
  getUnreadCount,
  type Notification,
} from "@/features/notifications/server";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authResult = await getAuthFromCookie();
  const user = authResult.success ? authResult.data : null;

  // Fetch notifications only if user is logged in
  let notifications: Notification[] | undefined;
  let unreadCount = 0;

  if (user) {
    const [notificationsResult, unreadResult] = await Promise.all([
      getNotifications(1, 10),
      getUnreadCount(),
    ]);
    notifications = notificationsResult.success
      ? notificationsResult.data.data
      : [];
    unreadCount = unreadResult.success ? unreadResult.data : 0;
  }

  return (
    <>
      <Header
        user={user}
        notifications={notifications}
        unreadNotificationCount={unreadCount}
      />
      <main className="min-h-screen">{children}</main>
    </>
  );
}
