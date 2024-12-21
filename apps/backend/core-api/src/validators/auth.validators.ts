import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6).trim()
});

export const ResendConfirmCodeSchema = z.object({
  email: z.string().email().trim()
});

export const ConfirmSignUpSchema = z.object({
  email: z.string().email().trim(),
  code: z.string().length(6).trim()
});

export const SignInSchema = z.object({
  email: z.string().trim(),
  password: z.string().trim()
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email().trim()
});

export const ResetPasswordSchema = z.object({
  email: z.string().trim(),
  code: z.string().length(6).trim(),
  newPassword: z.string().min(6).trim()
});
