import { getAuthFromCookie, hasRole } from "@/features/auth/server";
import { getAllGenres } from "@/features/admin/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { GenresList } from "@/features/admin/components/genres";

export const metadata: Metadata = {
  title: "Quản lý thể loại | Nekozanedex Admin",
  description: "Quản lý thể loại truyện",
};

export default async function GenresPage() {
  const authResult = await getAuthFromCookie();
  if (!authResult.success || !hasRole(authResult.data, ["admin"])) {
    redirect("/auth/login");
  }

  const genresResult = await getAllGenres();
  const genres = genresResult.success ? genresResult.data : [];

  return <GenresList genres={genres} />;
}
