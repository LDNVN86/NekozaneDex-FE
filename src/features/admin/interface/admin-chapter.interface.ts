/**
 * Admin chapter entity - full chapter data for admin panel
 */
export interface AdminChapter {
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
