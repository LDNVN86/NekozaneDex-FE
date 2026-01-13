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
