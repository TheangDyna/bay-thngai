export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
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
