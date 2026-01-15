"use server";

import { revalidatePath } from "next/cache";
import { addBookmark, removeBookmark } from "../server";

export async function toggleBookmarkAction(
  storyId: string,
  storySlug: string,
  isCurrentlyBookmarked: boolean
): Promise<{ success: boolean; isBookmarked: boolean; error?: string }> {
  try {
    if (isCurrentlyBookmarked) {
      const result = await removeBookmark(storyId);
      if (!result.success) {
        return { success: false, isBookmarked: true, error: result.error };
      }
      revalidatePath(`/client/stories/${storySlug}`);
      revalidatePath("/client/profile");
      return { success: true, isBookmarked: false };
    } else {
      const result = await addBookmark(storyId);
      if (!result.success) {
        return { success: false, isBookmarked: false, error: result.error };
      }
      revalidatePath(`/client/stories/${storySlug}`);
      revalidatePath("/client/profile");
      return { success: true, isBookmarked: true };
    }
  } catch (error) {
    return {
      success: false,
      isBookmarked: isCurrentlyBookmarked,
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}
