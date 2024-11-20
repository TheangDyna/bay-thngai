export interface RegisterRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role?: "user" | "admin";
}

export interface VerifyUserRequest {
  email: string;
  code: string;
}

export interface ResendVerifyCodeRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleCallbackRequest {
  code: string;
  state: string;
  error?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  sub: string;
}
