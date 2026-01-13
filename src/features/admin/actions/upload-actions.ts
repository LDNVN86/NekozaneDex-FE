"use server";

import { authFetchFormData } from "@/shared/lib/server-auth";

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadImageAction(
  formData: FormData
): Promise<UploadResult> {
  const result = await authFetchFormData<{ url: string }>(
    "/admin/media",
    formData
  );

  if (result.success) {
    return { success: true, url: result.data.url };
  }

  return { success: false, error: result.error };
}
