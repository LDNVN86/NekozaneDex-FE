import "server-only";
import { serverFetch, withAuthFetch } from "@/shared/lib/api";
import type { Result } from "@/shared/lib/result";

// Types
export interface UserSettings {
  id: string;
  user_id: string;
  theme: "light" | "dark" | "system";
  font_size: number;
  font_family: string;
  line_height: number;
  reading_bg: "white" | "sepia" | "dark" | "black";
  auto_scroll_speed: number;
  updated_at: string;
}

export interface UpdateSettingsInput {
  theme?: string;
  font_size?: number;
  font_family?: string;
  line_height?: number;
  reading_bg?: string;
  auto_scroll_speed?: number;
}

/**
 * Get user settings
 */
export async function getUserSettings(): Promise<Result<UserSettings>> {
  return withAuthFetch(async (headers) => {
    const res = await serverFetch<{ data: UserSettings }>(`/settings`, {
      headers,
    });
    return res.data;
  }, "Không thể lấy settings");
}

/**
 * Update user settings
 */
export async function updateUserSettings(
  settings: UpdateSettingsInput
): Promise<Result<UserSettings>> {
  return withAuthFetch(async (headers) => {
    const res = await serverFetch<{ data: UserSettings }>(`/settings`, {
      method: "PUT",
      headers,
      body: JSON.stringify(settings),
    });
    return res.data;
  }, "Không thể cập nhật settings");
}
