import "server-only";
import { serverFetch } from "@/shared/lib/api";
import { getAuthHeaders } from "@/shared/lib/server-auth";
import { ok, err, type Result } from "@/response/response";
import type {
  AdminChapter,
  ChapterFormData,
  SingleResponse,
} from "../interface";

export async function getChaptersByStoryId(
  storyId: string
): Promise<Result<AdminChapter[]>> {
  try {
    const headers = await getAuthHeaders();
    const data = await serverFetch<SingleResponse<AdminChapter[]>>(
      `/admin/stories/${storyId}/chapters`,
      { headers }
    );
    return ok(data.data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Không thể lấy chapters"
    );
  }
}

export async function getChapterById(
  id: string
): Promise<Result<AdminChapter>> {
  try {
    const headers = await getAuthHeaders();
    const data = await serverFetch<SingleResponse<AdminChapter>>(
      `/admin/chapters/${id}`,
      { headers }
    );
    return ok(data.data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Không tìm thấy chapter"
    );
  }
}

export async function createChapter(
  storyId: string,
  formData: ChapterFormData
): Promise<Result<AdminChapter>> {
  try {
    const headers = await getAuthHeaders();
    const data = await serverFetch<SingleResponse<AdminChapter>>(
      `/admin/stories/${storyId}/chapters`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      }
    );
    return ok(data.data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Không thể tạo chapter"
    );
  }
}

export async function updateChapter(
  id: string,
  formData: ChapterFormData
): Promise<Result<void>> {
  try {
    const headers = await getAuthHeaders();
    await serverFetch(`/admin/chapters/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(formData),
    });
    return ok(undefined);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Không thể cập nhật chapter"
    );
  }
}

export async function deleteChapter(id: string): Promise<Result<void>> {
  try {
    const headers = await getAuthHeaders();
    await serverFetch(`/admin/chapters/${id}`, {
      method: "DELETE",
      headers,
    });
    return ok(undefined);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Không thể xóa chapter"
    );
  }
}

export async function publishChapter(id: string): Promise<Result<void>> {
  try {
    const headers = await getAuthHeaders();
    await serverFetch(`/admin/chapters/${id}/publish`, {
      method: "POST",
      headers,
    });
    return ok(undefined);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Không thể xuất bản chapter"
    );
  }
}

export async function scheduleChapter(
  id: string,
  scheduledAt: string
): Promise<Result<void>> {
  try {
    const headers = await getAuthHeaders();
    await serverFetch(`/admin/chapters/${id}/schedule`, {
      method: "POST",
      headers,
      body: JSON.stringify({ scheduled_at: scheduledAt }),
    });
    return ok(undefined);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Không thể hẹn giờ xuất bản"
    );
  }
}

export interface BulkChapterData {
  title: string;
  images: string[];
}

export async function bulkImportChapters(
  storyId: string,
  chapters: BulkChapterData[]
): Promise<Result<AdminChapter[]>> {
  try {
    const headers = await getAuthHeaders();
    const data = await serverFetch<SingleResponse<AdminChapter[]>>(
      `/admin/stories/${storyId}/chapters/bulk`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ chapters }),
      }
    );
    return ok(data.data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Không thể import chapters"
    );
  }
}
