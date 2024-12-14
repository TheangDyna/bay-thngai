import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email("Invalid email format").trim(),
  password: z.string().min(6, "Password must be at least 6 characters").trim()
});

export const ResendConfirmCodeSchema = z.object({
  email: z.string().email("Invalid email format").trim()
});

export const ConfirmSignUpSchema = z.object({
  email: z.string().email("Invalid email format").trim(),
  code: z.string().length(6, "Code must be 6 characters").trim()
});

export const SignInSchema = z.object({
  email: z.string().min(1, "Email is required").trim(),
  password: z.string().min(1, "Password is required").trim()
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format").trim()
});

export const ResetPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").trim(),
  code: z.string().length(6, "Code must be 6 characters").trim(),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .trim()
});
