import "server-only";
import { serverFetch, withAuthFetch } from "@/shared/lib/api";
import type { Result } from "@/shared/lib/result";
import type {
  AdminStory,
  StoryFormData,
  PaginatedResponse,
  SingleResponse,
} from "../interface";

export async function getAdminStories(
  page = 1,
  limit = 20,
  search = ""
): Promise<Result<PaginatedResponse<AdminStory>>> {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
  return withAuthFetch(
    (headers) =>
      serverFetch<PaginatedResponse<AdminStory>>(
        `/admin/stories?page=${page}&limit=${limit}${searchParam}`,
        { headers }
      ),
    "Không thể lấy danh sách truyện"
  );
}

export async function getStoryById(id: string): Promise<Result<AdminStory>> {
  return withAuthFetch(async (headers) => {
    const data = await serverFetch<SingleResponse<AdminStory>>(
      `/admin/stories/${id}`,
      { headers }
    );
    return data.data;
  }, "Không tìm thấy truyện");
}

export async function createStory(
  formData: StoryFormData
): Promise<Result<AdminStory>> {
  return withAuthFetch(async (headers) => {
    const data = await serverFetch<SingleResponse<AdminStory>>(
      "/admin/stories",
      {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      }
    );
    return data.data;
  }, "Không thể tạo truyện");
}

export async function updateStory(
  id: string,
  formData: StoryFormData
): Promise<Result<void>> {
  return withAuthFetch(async (headers) => {
    await serverFetch(`/admin/stories/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(formData),
    });
  }, "Không thể cập nhật truyện");
}

export async function deleteStory(id: string): Promise<Result<void>> {
  return withAuthFetch(async (headers) => {
    await serverFetch(`/admin/stories/${id}`, {
      method: "DELETE",
      headers,
    });
  }, "Không thể xóa truyện");
}
