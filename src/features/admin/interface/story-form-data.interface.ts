import type { StoryStatus } from "./story-status.type";

export interface StoryFormData {
  title: string;
  original_title?: string;
  alt_titles?: string[];
  description?: string;
  cover_image_url?: string;
  author_name?: string;
  artist_name?: string;
  translator?: string;
  source_url?: string;
  source_name?: string;
  country?: string;
  release_year?: number;
  end_year?: number;
  status: StoryStatus;
  is_published: boolean;
  genre_ids: string[];
}
