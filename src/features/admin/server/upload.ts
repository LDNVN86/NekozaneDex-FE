import "server-only";
import { serverFetch } from "@/shared/lib/api";
import { getAuthHeaders } from "@/shared/lib/server-auth";
import { ok, err, type Result } from "@/shared/lib/result";
import type { SingleResponse } from "../interface";

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
