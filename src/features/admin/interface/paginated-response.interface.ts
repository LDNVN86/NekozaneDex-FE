/**
 * Generic paginated response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

/**
 * Generic single response structure
 */
export interface SingleResponse<T> {
  data: T;
  message?: string;
}
