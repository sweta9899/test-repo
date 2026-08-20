export interface LoginRequest {
  userId: string;
  password: string;
}

export interface User {
  id?: string;
  userId?: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

export type AuthUser = User;

export interface LoginResponse {
  status: string;
  data: {
    token: string;
    user: User;
  };
  message?: string;
}