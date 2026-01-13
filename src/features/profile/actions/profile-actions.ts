"use server";

import { revalidatePath } from "next/cache";
import { authFetch } from "@/shared/lib/server-auth";
import { type Result, ok, err } from "@/response/response";

// ============================================================================
// Types
// ============================================================================

interface ProfileData {
  id: string;
  email: string;
  username: string;
  role: string;
  avatar_url?: string;
  created_at: string;
}

// ============================================================================
// Actions
// ============================================================================

/**
 * Update user profile (username, avatar_url)
 */
export async function updateProfileAction(
  formData: FormData
): Promise<Result<ProfileData>> {
  const username = formData.get("username") as string | null;
  const avatarUrl = formData.get("avatar_url") as string | null;

  const body: Record<string, string> = {};
  if (username?.trim()) body.username = username.trim();
  if (avatarUrl?.trim()) body.avatar_url = avatarUrl.trim();

  if (Object.keys(body).length === 0) {
    return err("Không có thông tin để cập nhật");
  }

  const result = await authFetch<ProfileData>("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(body),
  });

  if (result.success) {
    revalidatePath("/client/profile");
    return ok(result.data);
  }

  return err(result.error);
}

/**
 * Change user password
 */
export async function changePasswordAction(
  formData: FormData
): Promise<Result<{ message: string }>> {
  const oldPassword = formData.get("old_password") as string;
  const newPassword = formData.get("new_password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  // Validation
  if (!oldPassword || !newPassword || !confirmPassword) {
    return err("Vui lòng điền đầy đủ thông tin");
  }

  if (newPassword.length < 8) {
    return err("Mật khẩu mới phải có ít nhất 8 ký tự");
  }

  if (newPassword !== confirmPassword) {
    return err("Xác nhận mật khẩu không khớp");
  }

  const result = await authFetch<{ message: string }>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
    }),
  });

  if (result.success) {
    return ok(result.data);
  }

  return err(result.error);
}
