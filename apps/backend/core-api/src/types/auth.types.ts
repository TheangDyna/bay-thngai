import { z } from "zod";
import {
  ConfirmSignUpSchema,
  ForgotPasswordSchema,
  ResendConfirmCodeSchema,
  ResetPasswordSchema,
  SignInSchema,
  SignUpSchema
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

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type ResendConfirmCodeUpInput = z.infer<typeof ResendConfirmCodeSchema>;
export type ConfirmSignUpInput = z.infer<typeof ConfirmSignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
