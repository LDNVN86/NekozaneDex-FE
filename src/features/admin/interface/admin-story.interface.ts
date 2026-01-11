import { Genre } from "@/features/story";
import type { StoryStatus } from "./story-status.type";

/**
 * Admin story entity - full story data for admin panel
 */
export interface AdminStory {
  id: string;
  title: string;
  slug: string;
  description?: string;
  cover_image_url?: string;
  author_name: string;
  translator?: string;
  source_url?: string;
  status: StoryStatus;
  view_count: number;
  total_chapters: number;
  is_published: boolean;
  genres?: Genre[];
  created_at?: string;
  updated_at?: string;
}
