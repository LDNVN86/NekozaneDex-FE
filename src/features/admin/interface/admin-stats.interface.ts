export interface AdminStats {
  total_stories: number;
  total_chapters: number;
  total_views: number;
  stories_this_week: number;
}

export interface TrafficDataPoint {
  date: string;
  views: number;
}
