"use server";

import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

interface RatingResponse {
  success: boolean;
  data?: {
    my_rating?: number;
    avg_rating: number;
    rating_count: number;
  };
  error?: string;
}

/**
 * Get story rating (public)
 */
export async function getStoryRating(storyId: string): Promise<RatingResponse> {
  try {
    const res = await fetch(`${API_URL}/ratings/story/${storyId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, error: "Không thể lấy rating" };
    }

    const json = await res.json();
    return { success: true, data: json.data };
  } catch {
    return { success: false, error: "Lỗi kết nối" };
  }
}

/**
 * Get user's rating for a story (authenticated)
 */
export async function getMyRating(storyId: string): Promise<RatingResponse> {
  try {
    const { getAuthHeaders } = await import("@/shared/lib/server-auth");
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_URL}/ratings/story/${storyId}/my`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, error: "Chưa đăng nhập" };
    }

    const json = await res.json();
    return { success: true, data: json.data };
  } catch {
    return { success: false, error: "Lỗi kết nối" };
  }
}

/**
 * Rate a story (authenticated)
 */
export async function rateStory(
  storyId: string,
  rating: number,
  storySlug?: string,
): Promise<RatingResponse> {
  try {
    const { getAuthHeaders } = await import("@/shared/lib/server-auth");
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_URL}/ratings/story/${storyId}`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
    });

    if (!res.ok) {
      const json = await res.json();
      return { success: false, error: json.message || "Không thể đánh giá" };
    }

    const json = await res.json();

    // Revalidate story page
    if (storySlug) {
      revalidatePath(`/client/stories/${storySlug}`);
    }

    return { success: true, data: json.data };
  } catch {
    return { success: false, error: "Lỗi kết nối" };
  }
}

/**
 * Delete user's rating (authenticated)
 */
export async function deleteMyRating(
  storyId: string,
  storySlug?: string,
): Promise<RatingResponse> {
  try {
    const { getAuthHeaders } = await import("@/shared/lib/server-auth");
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_URL}/ratings/story/${storyId}/my`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      return { success: false, error: "Không thể xóa đánh giá" };
    }

    const json = await res.json();

    // Revalidate story page
    if (storySlug) {
      revalidatePath(`/client/stories/${storySlug}`);
    }

    return { success: true, data: json.data };
  } catch {
    return { success: false, error: "Lỗi kết nối" };
  }
}
