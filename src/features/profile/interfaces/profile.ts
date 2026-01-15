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

// Matches API response from GET /reading-history
export interface HistoryItem {
  id: string;
  story_id: string;
  chapter_id: string;
  last_read_at: string;
  scroll_position: number;
  story: {
    id: string;
    title: string;
    slug: string;
    cover_image_url: string | null;
  };
  chapter: {
    id: string;
    title: string;
    chapter_number: number;
  };
}
