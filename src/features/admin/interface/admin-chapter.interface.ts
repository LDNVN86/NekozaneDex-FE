export interface AdminChapter {
  id: string;
  story_id: string;
  chapter_number: number;
  chapter_label?: string;
  chapter_type?: string;
  ordering?: number;
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
