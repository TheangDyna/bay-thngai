import { z } from "zod";
import {
  ConfirmRegisterSchema,
  ForgotPasswordSchema,
  ResendConfirmCodeSchema,
  ResetPasswordSchema,
  LoginSchema,
  RegisterSchema
} from "../validators/auth.validators";

export interface AuthResponse {
  status: string;
  message: string;
  data?: {
    token?: string;
  };
}

export interface CognitoToken {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  username: string;
}

export interface UserInfoFromIdToken {
  sub: string;
  email: string;
  [key: string]: any;
}

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ResendConfirmCodeUpInput = z.infer<typeof ResendConfirmCodeSchema>;
export type ConfirmRegisterInput = z.infer<typeof ConfirmRegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
