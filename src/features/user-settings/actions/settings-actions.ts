"use server";

import { revalidatePath } from "next/cache";
import { updateUserSettings } from "../server";
import type { UpdateSettingsInput } from "../server";

export async function updateUserSettingsAction(
  settings: UpdateSettingsInput
): Promise<{ success: boolean; error?: string }> {
  const result = await updateUserSettings(settings);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/client/profile");
  return { success: true };
}
