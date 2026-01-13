"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createStory as apiCreateStory,
  updateStory as apiUpdateStory,
  deleteStory as apiDeleteStory,
} from "../server";
import type { StoryFormState, StoryFormData, StoryStatus } from "../interface";
import {
  isValidUrl,
  validateRequired,
  validateMaxLength,
  hasErrors,
  type ValidationErrors,
} from "@/shared/lib/validation";

function parseFormData(formData: FormData): StoryFormData {
  return {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    cover_image_url:
      (formData.get("cover_image_url_url") as string) || undefined,
    author_name: (formData.get("author_name") as string) || undefined,
    translator: (formData.get("translator") as string) || undefined,
    source_url: (formData.get("source_url") as string) || undefined,
    status: (formData.get("status") as StoryStatus) || "ongoing",
    is_published: formData.get("is_published") === "true",
    genre_ids: formData.getAll("genre_ids") as string[],
  };
}

function validateFormData(data: StoryFormData): StoryFormState | null {
  const errors: ValidationErrors<StoryFormData> = {};

  const titleMinError = validateRequired(data.title, 2);
  if (titleMinError) {
    errors.title = "Tên truyện phải có ít nhất 2 ký tự";
  }

  const titleMaxError = validateMaxLength(data.title, 255);
  if (titleMaxError) {
    errors.title = "Tên truyện không được vượt quá 255 ký tự";
  }

  if (data.source_url && !isValidUrl(data.source_url)) {
    errors.source_url = "Link nguồn không hợp lệ";
  }

  if (hasErrors(errors)) {
    return {
      success: false,
      message: "Vui lòng kiểm tra lại thông tin",
      fieldErrors: errors,
      values: data,
    };
  }

  return null;
}

export async function createStoryAction(
  _prevState: StoryFormState,
  formData: FormData
): Promise<StoryFormState> {
  const data = parseFormData(formData);

  const validationError = validateFormData(data);
  if (validationError) return validationError;

  const result = await apiCreateStory(data);

  if (!result.success) {
    return {
      success: false,
      message: result.error,
      values: data,
    };
  }

  revalidatePath("/server/admin/stories");
  redirect(`/server/admin/stories/${result.data.id}`);
}

export async function updateStoryAction(
  storyId: string,
  _prevState: StoryFormState,
  formData: FormData
): Promise<StoryFormState> {
  const data = parseFormData(formData);

  const validationError = validateFormData(data);
  if (validationError) return validationError;

  const result = await apiUpdateStory(storyId, data);

  if (!result.success) {
    return {
      success: false,
      message: result.error,
      values: data,
    };
  }

  // Revalidate
  revalidatePath("/server/admin/stories");
  revalidatePath(`/server/admin/stories/${storyId}`);

  return {
    success: true,
    message: "Cập nhật truyện thành công!",
  };
}

export async function deleteStoryAction(storyId: string): Promise<void> {
  const result = await apiDeleteStory(storyId);

  if (!result.success) {
    throw new Error(result.error);
  }

  revalidatePath("/server/admin/stories");
}
