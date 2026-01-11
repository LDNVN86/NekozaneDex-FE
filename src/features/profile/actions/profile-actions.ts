"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { type Result, ok, err } from "@/response/response";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

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
// Helper
// ============================================================================

async function getAuthHeaders(): Promise<Result<Record<string, string>>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return err("Chưa đăng nhập");
  }

  return ok({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });
}

async function handleApiResponse<T>(res: Response): Promise<Result<T>> {
  // Handle non-JSON responses
  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    const text = await res.text();
    console.error("[API] Non-JSON response:", text.substring(0, 200));
    return err("Server trả về response không hợp lệ");
  }

  const data = await res.json();

  if (!res.ok) {
    return err(data.error || data.message || `Lỗi: ${res.status}`);
  }

  return ok(data as T);
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
  const headersResult = await getAuthHeaders();
  if (!headersResult.success) {
    return err(headersResult.error);
  }

  const username = formData.get("username") as string | null;
  const avatarUrl = formData.get("avatar_url") as string | null;

  const body: Record<string, string> = {};
  if (username?.trim()) body.username = username.trim();
  if (avatarUrl?.trim()) body.avatar_url = avatarUrl.trim();

  if (Object.keys(body).length === 0) {
    return err("Không có thông tin để cập nhật");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: headersResult.data,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const result = await handleApiResponse<ProfileData>(res);

    if (result.success) {
      revalidatePath("/client/profile");
    }

    return result;
  } catch (error) {
    console.error("[updateProfileAction] Error:", error);
    return err(error instanceof Error ? error.message : "Lỗi không xác định");
  }
}

/**
 * Change user password
 */
export async function changePasswordAction(
  formData: FormData
): Promise<Result<{ message: string }>> {
  const headersResult = await getAuthHeaders();
  if (!headersResult.success) {
    return err(headersResult.error);
  }

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

  try {
    const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: headersResult.data,
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
      cache: "no-store",
    });

    return handleApiResponse<{ message: string }>(res);
  } catch (error) {
    console.error("[changePasswordAction] Error:", error);
    return err(error instanceof Error ? error.message : "Lỗi không xác định");
  }
}
