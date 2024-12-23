import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6).trim()
});

export const ResendConfirmCodeSchema = z.object({
  email: z.string().email().trim()
});

export const ConfirmSignUpSchema = z.object({
  email: z.string().trim().email(),
  code: z.string().trim().length(6)
});

export const SignInSchema = z.object({
  email: z.string().trim(),
  password: z.string().trim()
});

export const ForgotPasswordSchema = z.object({
  email: z.string().trim().email()
});

export const ResetPasswordSchema = z.object({
  email: z.string().trim(),
  code: z.string().trim().length(6),
  newPassword: z.string().trim().min(6)
});
