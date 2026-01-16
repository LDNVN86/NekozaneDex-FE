import "server-only";
import { serverFetch } from "@/shared/lib/api";
import type { Result } from "@/shared/lib/result";

export interface PublicUserProfile {
  id: string;
  username: string;
  tag_name: string;
  avatar_url?: string;
  role: string;
  created_at: string;
}

/**
 * Get public user profile by tag_name
 */
export async function getUserByTagName(
  tagName: string,
): Promise<Result<PublicUserProfile>> {
  try {
    const res = await serverFetch<{ data: PublicUserProfile }>(
      `/users/${tagName}`,
    );
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Không tìm thấy người dùng",
    };
  }
}
