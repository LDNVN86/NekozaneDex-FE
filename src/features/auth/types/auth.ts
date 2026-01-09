export type AuthUser = {
  id: string;
  email: string;
  username: string;
  role: string;
  avatar_url?: string | null;
  created_at?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};
