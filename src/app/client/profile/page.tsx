import { redirect } from "next/navigation";
import { getAuthFromCookie } from "@/features/auth/server";
import { getMyBookmarks } from "@/features/profile/server";
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

  // Fetch bookmarks
  const bookmarksResult = await getMyBookmarks(1, 50);
  const bookmarks = bookmarksResult.success
    ? bookmarksResult.data.data ?? bookmarksResult.data ?? []
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
      history={[]} // TODO: Add history API when available
    />
  );
}
