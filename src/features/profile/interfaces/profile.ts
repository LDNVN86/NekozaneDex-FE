import type { Story } from "@/features/story/interface/story-interface";

export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
}

// Matches API response from GET /bookmarks
export interface BookmarkItem {
  id: string;
  story_id: string;
  created_at: string;
  story: Story;
}

export interface HistoryItem {
  id: string;
  story_id: string;
  chapter_number: number;
  last_read_at: string;
  story: Story;
}
