"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createChapter as apiCreateChapter,
  updateChapter as apiUpdateChapter,
  deleteChapter as apiDeleteChapter,
  publishChapter as apiPublishChapter,
} from "../server/api";
import type { ChapterFormState, ChapterFormData } from "../interface";

function parseFormData(formData: FormData): ChapterFormData {
  const imagesRaw = formData.get("images") as string;
  let images: string[] = [];

  try {
    images = JSON.parse(imagesRaw || "[]");
  } catch {
    // If not JSON, try splitting by newline
    images = imagesRaw
      ? imagesRaw
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  }

  return {
    title: formData.get("title") as string,
    images,
  };
}

function validateFormData(data: ChapterFormData): ChapterFormState | null {
  const errors: ChapterFormState["fieldErrors"] = {};

  if (!data.title || data.title.trim().length < 1) {
    errors.title = "Tiêu đề chapter không được để trống";
  }

  if (!data.images || data.images.length === 0) {
    errors.images = "Vui lòng thêm ít nhất 1 ảnh";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Vui lòng kiểm tra lại thông tin",
      fieldErrors: errors,
      values: data,
    };
  }

  return null;
}

export async function createChapterAction(
  storyId: string,
  _prevState: ChapterFormState,
  formData: FormData
): Promise<ChapterFormState> {
  const data = parseFormData(formData);

  // Validate
  const validationError = validateFormData(data);
  if (validationError) return validationError;

  // Call API
  const result = await apiCreateChapter(storyId, data);

  if (!result.success) {
    return {
      success: false,
      message: result.error,
      values: data,
    };
  }

  // Revalidate and redirect
  revalidatePath(`/server/admin/stories/${storyId}/chapters`);
  redirect(`/server/admin/stories/${storyId}/chapters`);
}

export async function updateChapterAction(
  chapterId: string,
  storyId: string,
  _prevState: ChapterFormState,
  formData: FormData
): Promise<ChapterFormState> {
  const data = parseFormData(formData);

  // Validate
  const validationError = validateFormData(data);
  if (validationError) return validationError;

  // Call API
  const result = await apiUpdateChapter(chapterId, data);

  if (!result.success) {
    return {
      success: false,
      message: result.error,
      values: data,
    };
  }

  // Revalidate
  revalidatePath(`/server/admin/stories/${storyId}/chapters`);

  return {
    success: true,
    message: "Cập nhật chapter thành công!",
  };
}

export async function deleteChapterAction(
  chapterId: string,
  storyId: string
): Promise<void> {
  const result = await apiDeleteChapter(chapterId);

  if (!result.success) {
    throw new Error(result.error);
  }

  revalidatePath(`/server/admin/stories/${storyId}/chapters`);
}

export async function publishChapterAction(
  chapterId: string,
  storyId: string
): Promise<void> {
  const result = await apiPublishChapter(chapterId);

  if (!result.success) {
    throw new Error(result.error);
  }

  revalidatePath(`/server/admin/stories/${storyId}/chapters`);
}

export async function scheduleChapterAction(
  chapterId: string,
  storyId: string,
  scheduledAt: string
): Promise<void> {
  const { scheduleChapter } = await import("../server/api");
  const result = await scheduleChapter(chapterId, scheduledAt);

  if (!result.success) {
    throw new Error(result.error);
  }

  revalidatePath(`/server/admin/stories/${storyId}/chapters`);
}

export async function bulkImportChaptersAction(
  storyId: string,
  chapters: { title: string; images: string[] }[]
): Promise<void> {
  const { bulkImportChapters } = await import("../server/api");
  const result = await bulkImportChapters(storyId, chapters);

  if (!result.success) {
    throw new Error(result.error);
  }

  revalidatePath(`/server/admin/stories/${storyId}/chapters`);
}
