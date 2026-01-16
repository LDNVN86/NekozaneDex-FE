import { redirect } from "next/navigation";
import { getAuthFromCookie } from "@/features/auth/server";
import { getMyBookmarks } from "@/features/profile/server";
import { getReadingHistory } from "@/features/reading-history/server";
import { getNotifications } from "@/features/notifications/server";
import { ProfileContent } from "@/features/profile/components/profile-content";
import { createMetadata } from "@/shared/lib/seo";

export const metadata = createMetadata({
  title: "Trang Cá Nhân",
  description: "Quản lý thông tin cá nhân và truyện đã đánh dấu",
});

export default async function ProfilePage() {
  // Check authentication
  const authResult = await getAuthFromCookie();

  if (!authResult.success) {
    redirect("/auth/login?redirect=/client/profile");
  }

  const user = authResult.data;

  // Fetch bookmarks, history, and notifications in parallel
  const [bookmarksResult, historyResult, notificationsResult] =
    await Promise.all([
      getMyBookmarks(1, 50),
      getReadingHistory(1, 50),
      getNotifications(1, 100),
    ]);

  const bookmarks = bookmarksResult.success
    ? (bookmarksResult.data.data ?? bookmarksResult.data ?? [])
    : [];

  const history = historyResult.success ? (historyResult.data.data ?? []) : [];

  const notifications = notificationsResult.success
    ? (notificationsResult.data.data ?? [])
    : [];

  return (
    <ProfileContent
      user={{
        id: user.id,
        name: user.username,
        email: user.email,
        avatar: user.avatar_url ?? undefined,
        joinedAt: user.created_at ?? new Date().toISOString(),
      }}
      bookmarks={bookmarks}
      history={history}
      notifications={notifications}
    />
  );
}
