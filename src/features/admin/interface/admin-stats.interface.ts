/**
 * Dashboard statistics
 */
export interface AdminStats {
  total_stories: number;
  total_chapters: number;
  total_views: number;
  stories_this_week: number;
}

/**
 * Traffic data point for charts
 */
export interface TrafficDataPoint {
  date: string;
  views: number;
}
