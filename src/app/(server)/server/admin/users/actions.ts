"use server";

import { updateUser, resetUserPassword } from "@/features/admin/server";
import type { UpdateUserData } from "@/features/admin/server/users";
import type { Result } from "@/shared/lib/result";

export async function updateUserRoleAction(
  userId: string,
  role: "admin" | "reader"
): Promise<Result<{ id: string; role: string }>> {
  return updateUser(userId, { role });
}

export async function updateUserStatusAction(
  userId: string,
  isActive: boolean
): Promise<Result<{ id: string; is_active: boolean }>> {
  const { updateUserStatus } = await import("@/features/admin/server");
  return updateUserStatus(userId, isActive);
}

export async function updateUserInfoAction(
  userId: string,
  data: UpdateUserData
): Promise<
  Result<{ id: string; username: string; email: string; role: string }>
> {
  return updateUser(userId, data);
}

export async function resetUserPasswordAction(
  userId: string,
  newPassword: string
): Promise<Result<{ id: string }>> {
  return resetUserPassword(userId, newPassword);
}
