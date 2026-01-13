import "server-only";
import { serverFetch, withAuthFetch } from "@/shared/lib/api";
import type { Result } from "@/shared/lib/result";
import type {
  AdminChapter,
  ChapterFormData,
  SingleResponse,
} from "../interface";

export async function getChaptersByStoryId(
  storyId: string
): Promise<Result<AdminChapter[]>> {
  return withAuthFetch(async (headers) => {
    const data = await serverFetch<SingleResponse<AdminChapter[]>>(
      `/admin/stories/${storyId}/chapters`,
      { headers }
    );
    return data.data;
  }, "Không thể lấy chapters");
}

export async function getChapterById(
  id: string
): Promise<Result<AdminChapter>> {
  return withAuthFetch(async (headers) => {
    const data = await serverFetch<SingleResponse<AdminChapter>>(
      `/admin/chapters/${id}`,
      { headers }
    );
    return data.data;
  }, "Không tìm thấy chapter");
}

export async function createChapter(
  storyId: string,
  formData: ChapterFormData
): Promise<Result<AdminChapter>> {
  return withAuthFetch(async (headers) => {
    const data = await serverFetch<SingleResponse<AdminChapter>>(
      `/admin/stories/${storyId}/chapters`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      }
    );
    return data.data;
  }, "Không thể tạo chapter");
}

export async function updateChapter(
  id: string,
  formData: ChapterFormData
): Promise<Result<void>> {
  return withAuthFetch(async (headers) => {
    await serverFetch(`/admin/chapters/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(formData),
    });
  }, "Không thể cập nhật chapter");
}

export async function deleteChapter(id: string): Promise<Result<void>> {
  return withAuthFetch(async (headers) => {
    await serverFetch(`/admin/chapters/${id}`, {
      method: "DELETE",
      headers,
    });
  }, "Không thể xóa chapter");
}

export async function publishChapter(id: string): Promise<Result<void>> {
  return withAuthFetch(async (headers) => {
    await serverFetch(`/admin/chapters/${id}/publish`, {
      method: "POST",
      headers,
    });
  }, "Không thể xuất bản chapter");
}

export async function scheduleChapter(
  id: string,
  scheduledAt: string
): Promise<Result<void>> {
  return withAuthFetch(async (headers) => {
    await serverFetch(`/admin/chapters/${id}/schedule`, {
      method: "POST",
      headers,
      body: JSON.stringify({ scheduled_at: scheduledAt }),
    });
  }, "Không thể hẹn giờ xuất bản");
}

export interface BulkChapterData {
  title: string;
  images: string[];
}

export async function bulkImportChapters(
  storyId: string,
  chapters: BulkChapterData[]
): Promise<Result<AdminChapter[]>> {
  return withAuthFetch(async (headers) => {
    const data = await serverFetch<SingleResponse<AdminChapter[]>>(
      `/admin/stories/${storyId}/chapters/bulk`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ chapters }),
      }
    );
    return data.data;
  }, "Không thể import chapters");
}
