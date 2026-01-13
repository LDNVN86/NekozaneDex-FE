export type StoryStatus = "ongoing" | "completed" | "paused";

export const STORY_STATUS_OPTIONS: { value: StoryStatus; label: string }[] = [
  { value: "ongoing", label: "Đang tiến hành" },
  { value: "completed", label: "Hoàn thành" },
  { value: "paused", label: "Tạm dừng" },
];
