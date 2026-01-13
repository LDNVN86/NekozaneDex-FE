"use server";

import { revalidatePath } from "next/cache";
import { serverFetch, withAuthFetch } from "@/shared/lib/api";
import type { Genre, SingleResponse } from "../interface";

export interface GenreFormState {
  success: boolean;
  message?: string;
  fieldErrors?: {
    name?: string;
    description?: string;
  };
}

const GENRE_NAME_MIN = 1;
const GENRE_NAME_MAX = 50;
const GENRE_DESC_MAX = 500;

function validateGenreData(
  name: string,
  description?: string
): GenreFormState | null {
  const trimmedName = name?.trim();

  if (!trimmedName) {
    return {
      success: false,
      fieldErrors: { name: "Tên thể loại không được để trống" },
    };
  }

  if (
    trimmedName.length < GENRE_NAME_MIN ||
    trimmedName.length > GENRE_NAME_MAX
  ) {
    return {
      success: false,
      fieldErrors: {
        name: `Tên thể loại phải từ ${GENRE_NAME_MIN} đến ${GENRE_NAME_MAX} ký tự`,
      },
    };
  }

  if (description && description.length > GENRE_DESC_MAX) {
    return {
      success: false,
      fieldErrors: {
        description: `Mô tả không được quá ${GENRE_DESC_MAX} ký tự`,
      },
    };
  }

  return null;
}

export async function createGenreAction(
  _prevState: GenreFormState,
  formData: FormData
): Promise<GenreFormState> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;

  const validationError = validateGenreData(name, description || undefined);
  if (validationError) return validationError;

  const result = await withAuthFetch(
    (headers) =>
      serverFetch<SingleResponse<Genre>>("/admin/genres", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: name.trim(),
          description: description?.trim() || null,
        }),
      }),
    "Lỗi khi tạo thể loại"
  );

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/server/admin/genres");
  return { success: true, message: "Tạo thể loại thành công!" };
}

export async function updateGenreAction(
  genreId: string,
  _prevState: GenreFormState,
  formData: FormData
): Promise<GenreFormState> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;

  const validationError = validateGenreData(name, description || undefined);
  if (validationError) return validationError;

  const result = await withAuthFetch(
    (headers) =>
      serverFetch<SingleResponse<Genre>>(`/admin/genres/${genreId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          name: name.trim(),
          description: description?.trim() || null,
        }),
      }),
    "Lỗi khi cập nhật thể loại"
  );

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/server/admin/genres");
  return { success: true, message: "Cập nhật thành công!" };
}

export async function deleteGenreAction(genreId: string): Promise<{
  success: boolean;
  message?: string;
}> {
  const result = await withAuthFetch(
    (headers) =>
      serverFetch(`/admin/genres/${genreId}`, {
        method: "DELETE",
        headers,
      }),
    "Lỗi khi xóa thể loại"
  );

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/server/admin/genres");
  return { success: true, message: "Xóa thể loại thành công!" };
}
