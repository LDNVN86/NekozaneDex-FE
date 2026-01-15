"use server";

import { revalidatePath } from "next/cache";
import { markAsRead, markAllAsRead } from "../server";

export async function markNotificationAsReadAction(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  const result = await markAsRead(notificationId);
  if (!result.success) {
    return { success: false, error: result.error };
  }
  revalidatePath("/");
  return { success: true };
}

export async function markAllNotificationsReadAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  const result = await markAllAsRead();
  if (!result.success) {
    return { success: false, error: result.error };
  }
  revalidatePath("/");
  return { success: true };
}
