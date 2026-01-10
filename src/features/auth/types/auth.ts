export type AuthUser = {
  id: string;
  email: string;
  username: string;
  role: "reader" | "admin";
  avatar_url?: string | null;
  created_at?: string;
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
