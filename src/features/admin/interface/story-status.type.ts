/**
 * Story status enumeration
 */
export type StoryStatus = "ongoing" | "completed" | "paused";

/**
 * Status display options for UI
 */
export const STORY_STATUS_OPTIONS: { value: StoryStatus; label: string }[] = [
  { value: "ongoing", label: "Đang tiến hành" },
  { value: "completed", label: "Hoàn thành" },
  { value: "paused", label: "Tạm dừng" },
];
