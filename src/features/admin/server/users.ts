import "server-only";
import { withAuthFetch, serverFetch } from "@/shared/lib/api";
import type { Result } from "@/shared/lib/result";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  role: "admin" | "reader";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAdminUsers(
  page = 1,
  limit = 20,
  search = ""
): Promise<Result<PaginatedResponse<AdminUser>>> {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
  return withAuthFetch(
    (headers) =>
      serverFetch<PaginatedResponse<AdminUser>>(
        `/admin/users?page=${page}&limit=${limit}${searchParam}`,
        { headers }
      ),
    "Không thể lấy danh sách người dùng"
  );
}

export async function updateUserRole(
  userId: string,
  role: "admin" | "reader"
): Promise<Result<{ id: string; role: string }>> {
  return withAuthFetch(
    (headers) =>
      serverFetch<{ data: { id: string; role: string } }>(
        `/admin/users/${userId}/role`,
        {
          method: "PUT",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        }
      ).then((res) => res.data),
    "Không thể cập nhật role"
  );
}

export async function updateUserStatus(
  userId: string,
  isActive: boolean
): Promise<Result<{ id: string; is_active: boolean }>> {
  return withAuthFetch(
    (headers) =>
      serverFetch<{ data: { id: string; is_active: boolean } }>(
        `/admin/users/${userId}/status`,
        {
          method: "PUT",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: isActive }),
        }
      ).then((res) => res.data),
    "Không thể cập nhật trạng thái"
  );
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  role?: "admin" | "reader";
}

export async function updateUser(
  userId: string,
  data: UpdateUserData
): Promise<
  Result<{ id: string; username: string; email: string; role: string }>
> {
  return withAuthFetch(
    (headers) =>
      serverFetch<{
        data: { id: string; username: string; email: string; role: string };
      }>(`/admin/users/${userId}`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.data),
    "Không thể cập nhật thông tin"
  );
}

export async function resetUserPassword(
  userId: string,
  newPassword: string
): Promise<Result<{ id: string }>> {
  return withAuthFetch(
    (headers) =>
      serverFetch<{ data: { id: string } }>(`/admin/users/${userId}/password`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: newPassword }),
      }).then((res) => res.data),
    "Không thể đổi mật khẩu"
  );
}
