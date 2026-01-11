"use server";

import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Server action to upload image to Cloudinary via backend
 */
export async function uploadImageAction(
  formData: FormData
): Promise<UploadResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return { success: false, error: "Chưa đăng nhập" };
    }

    const response = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Upload failed: ${response.status}`,
      };
    }

    const data = await response.json();
    const url = data.data?.url || data.url;

    if (!url) {
      return { success: false, error: "Không nhận được URL từ server" };
    }

    return { success: true, url };
  } catch (error) {
    console.error("[Upload Action] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi upload ảnh",
    };
  }
}
