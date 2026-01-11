import "server-only";
import { cookies } from "next/headers";
import { serverFetch } from "@/shared/lib/api";
import { isTokenValid } from "@/shared/lib/token-utils";
import { getValidAccessToken } from "@/shared/lib/token-refresh";
import { ok, err, type Result } from "@/response/response";
import type {
  AdminStory,
  AdminChapter,
  Genre,
  StoryFormData,
  ChapterFormData,
  PaginatedResponse,
  SingleResponse,
} from "../interface";

// ===== AUTH HELPER =====

/**
 * Get authorization headers for admin API requests
 * Includes proactive token refresh if token is expiring soon
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("access_token")?.value;
  const csrfToken = cookieStore.get("csrf_token")?.value;

  // Proactive token refresh - refresh if expiring within 60 seconds
  if (accessToken && !isTokenValid(accessToken, 60)) {
    console.log("[Admin API] Token expiring soon, attempting refresh...");
    const newToken = await getValidAccessToken(accessToken);
    if (newToken) {
      accessToken = newToken;
    } else {
      console.warn("[Admin API] Token refresh failed, using existing token");
    }
  }

  const headers: HeadersInit = {};

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
    headers["Cookie"] = `csrf_token=${csrfToken}; access_token=${
      accessToken || ""
    }`;
  }

  return headers;
}

// ===== STORIES =====

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

// ===== GENRES =====

export async function getAllGenres(): Promise<Result<Genre[]>> {
  try {
    const data = await serverFetch<SingleResponse<Genre[]>>("/genres");
    return ok(data.data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Không thể lấy thể loại"
    );
  }
}

// ===== CHAPTERS =====

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

// ===== BULK IMPORT =====

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

// ===== UPLOAD =====

export interface UploadResponse {
  url: string;
  public_id: string;
}

export async function uploadSingleImage(
  formData: FormData
): Promise<Result<UploadResponse>> {
  try {
    const headers = await getAuthHeaders();
    const data = await serverFetch<SingleResponse<UploadResponse>>(
      "/admin/upload",
      {
        method: "POST",
        headers: {
          ...headers,
          // Don't set Content-Type for FormData, browser will set it with boundary
        },
        body: formData,
      }
    );
    return ok(data.data);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Không thể upload ảnh");
  }
}

export async function uploadChapterImages(
  formData: FormData
): Promise<Result<UploadResponse[]>> {
  try {
    const headers = await getAuthHeaders();
    const data = await serverFetch<SingleResponse<UploadResponse[]>>(
      "/admin/upload/chapter",
      {
        method: "POST",
        headers: {
          ...headers,
        },
        body: formData,
      }
    );
    return ok(data.data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Không thể upload ảnh chapter"
    );
  }
}

export async function deleteImage(publicId: string): Promise<Result<void>> {
  try {
    const headers = await getAuthHeaders();
    await serverFetch("/admin/upload", {
      method: "DELETE",
      headers,
      body: JSON.stringify({ public_id: publicId }),
    });
    return ok(undefined);
  } catch (error) {
    return err(error instanceof Error ? error.message : "Không thể xóa ảnh");
  }
}
