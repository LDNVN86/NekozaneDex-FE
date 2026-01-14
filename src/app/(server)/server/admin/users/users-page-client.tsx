"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import type { AdminUser } from "@/features/admin/server/users";
import { UsersSearchInput } from "./users-search-input";
import { UsersTable } from "./users-table";
import { UsersPagination } from "./users-pagination";

interface UsersPageClientProps {
  users: AdminUser[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  initialSearch?: string;
}

export function UsersPageClient({
  users,
  pagination,
  initialSearch = "",
}: UsersPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(initialSearch);

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
        params.set("page", "1");
      }

      const newUrl = `/server/admin/users?${params.toString()}`;
      const currentUrl = `/server/admin/users?${searchParams.toString()}`;

      if (newUrl !== currentUrl) {
        router.push(newUrl);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, router, searchParams]);

  const clearSearch = () => {
    setSearchQuery("");
    router.push("/server/admin/users");
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/server/admin/users?${params.toString()}`);
  };

  const currentPage = Number.isFinite(pagination.page) ? pagination.page : 1;
  const totalPages = Number.isFinite(pagination.totalPages)
    ? pagination.totalPages
    : 1;
  const total = Number.isFinite(pagination.total) ? pagination.total : 0;

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <Users className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
          <p className="text-sm text-muted-foreground">
            {initialSearch
              ? `Tìm thấy ${total} người dùng cho "${initialSearch}"`
              : `Tổng cộng ${total} người dùng`}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Danh sách người dùng</CardTitle>
              <CardDescription>Quản lý tài khoản và phân quyền</CardDescription>
            </div>
            <UsersSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={clearSearch}
            />
          </div>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={users}
            emptyMessage={
              initialSearch
                ? "Không tìm thấy người dùng phù hợp"
                : "Chưa có người dùng nào"
            }
          />
          <UsersPagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </CardContent>
      </Card>
    </>
  );
}
