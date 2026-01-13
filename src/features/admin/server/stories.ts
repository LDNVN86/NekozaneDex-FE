import "server-only";
import { serverFetch } from "@/shared/lib/api";
import { getAuthHeaders } from "@/shared/lib/server-auth";
import { ok, err, type Result } from "@/response/response";
import type {
  AdminStory,
  StoryFormData,
  PaginatedResponse,
  SingleResponse,
} from "../interface";

export async function getAdminStories(
  page = 1,
  limit = 20
): Promise<Result<PaginatedResponse<AdminStory>>> {
  try {
    const headers = await getAuthHeaders();
    const data = await serverFetch<PaginatedResponse<AdminStory>>(
      `/admin/stories?page=${page}&limit=${limit}`,
      { headers }
    );
    return ok(data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Không thể lấy danh sách truyện"
    );
  }
}

export async function getStoryById(id: string): Promise<Result<AdminStory>> {
  try {
    const headers = await getAuthHeaders();
    const data = await serverFetch<SingleResponse<AdminStory>>(
      `/admin/stories/${id}`,
      { headers }
    );
    return ok(data.data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Không tìm thấy truyện"
    );
  }
}

export async function createStory(
  formData: StoryFormData
): Promise<Result<AdminStory>> {
  try {
    const headers = await getAuthHeaders();
    const data = await serverFetch<SingleResponse<AdminStory>>(
      "/admin/stories",
      {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      }
    );
    return ok(data.data);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Không thể tạo truyện");
  }
}

export async function updateStory(
  id: string,
  formData: StoryFormData
): Promise<Result<void>> {
  try {
    const headers = await getAuthHeaders();
    await serverFetch(`/admin/stories/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(formData),
    });
    return ok(undefined);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Không thể cập nhật truyện"
    );
  }
}

export async function deleteStory(id: string): Promise<Result<void>> {
  try {
    const headers = await getAuthHeaders();
    await serverFetch(`/admin/stories/${id}`, {
      method: "DELETE",
      headers,
    });
    return ok(undefined);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Không thể xóa truyện");
  }
}
