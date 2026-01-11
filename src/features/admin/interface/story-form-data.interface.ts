import type { StoryStatus } from "./story-status.type";

/**
 * Form data structure for creating/updating a story
 */
export interface StoryFormData {
  title: string;
  description?: string;
  cover_image_url?: string;
  author_name?: string;
  translator?: string;
  source_url?: string;
  status: StoryStatus;
  is_published: boolean;
  genre_ids: string[];
}
