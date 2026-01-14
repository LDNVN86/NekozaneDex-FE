import { getAuthFromCookie, hasRole } from "@/features/auth/server";
import { getAdminUsers } from "@/features/admin/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { UsersPageClient } from "./users-page-client";

export const metadata: Metadata = {
  title: "Quản lý người dùng | Nekozanedex Admin",
  description: "Danh sách và quản lý người dùng",
};

interface UsersPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  // Auth check
  const authResult = await getAuthFromCookie();
  if (!authResult.success || !hasRole(authResult.data, ["admin"])) {
    redirect("/auth/login");
  }

  // Get params
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const search = params.search || "";

  // Fetch users
  const usersResult = await getAdminUsers(page, 20, search);

  const users = usersResult.success
    ? usersResult.data
    : { data: [], total: 0, page: 1, limit: 20, total_pages: 0 };

  return (
    <UsersPageClient
      users={users.data}
      pagination={{
        page: users.page,
        totalPages: users.total_pages,
        total: users.total,
      }}
      initialSearch={search}
    />
  );
}
