import { getAuthFromCookie, hasRole } from "@/features/auth/server";
import { getAllGenres } from "@/features/admin/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { NewStoryPageClient } from "./new-story-page-client";

export const metadata: Metadata = {
  title: "Thêm truyện mới | Nekozanedex Admin",
  description: "Tạo truyện mới",
};

export default async function NewStoryPage() {
  // Auth check
  const authResult = await getAuthFromCookie();
  if (!authResult.success || !hasRole(authResult.data, ["admin"])) {
    redirect("/auth/login");
  }

  // Fetch genres
  const genresResult = await getAllGenres();
  const genres = genresResult.success ? genresResult.data : [];

  return <NewStoryPageClient genres={genres} />;
}
