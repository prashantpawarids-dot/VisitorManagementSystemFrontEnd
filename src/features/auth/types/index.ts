export type UserRole = "ADMIN" | "HOST" | "SECURITY";

export interface AuthUser {
  token: string;
  userId: number;
  fullName: string;
  username: string;
  roles: UserRole[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  fullName: string;
  username: string;
  roles: UserRole[];
}
