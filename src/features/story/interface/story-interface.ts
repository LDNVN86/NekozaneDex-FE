// ===== Story Types =====
export interface Story {
  id: string;
  title: string;
  slug: string;
  description?: string;
  cover_image_url?: string;
  author_name: string;
  status: StoryStatus;
  view_count: number;
  total_chapters: number;
  is_published: boolean;
  genres?: Genre[];
  created_at?: string;
  updated_at?: string;
}

export type StoryStatus = "ongoing" | "completed" | "paused";

export interface Chapter {
  id: string;
  story_id: string;
  chapter_number: number;
  title: string;
  images?: string[];
  page_count: number;
  is_published: boolean;
  published_at?: string;
  scheduled_at?: string;
  view_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface SingleResponse<T> {
  data: T;
  message?: string;
}
