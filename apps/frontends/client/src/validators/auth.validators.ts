// src/validators/auth.validators.ts
import { z } from "zod";

/** ─── LOGIN ──────────────────────────────────────────────────────────────── */
export const LoginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email address is required")
      .email("Invalid email address"),
    password: z.string().trim().min(1, "Password is required")
  })
  .strict();
export type LoginInput = z.infer<typeof LoginSchema>;

/** ─── SIGNUP ─────────────────────────────────────────────────────────────── */
export const SignupSchema = z
  .object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password")
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
  });
export type SignupInput = z.infer<typeof SignupSchema>;

/** ─── CONFIRM REGISTRATION (OTP) ───────────────────────────────────────── */
export const ConfirmRegisterSchema = z
  .object({
    email: z.string().trim().email("Invalid email address"),
    code: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Code must be exactly 6 digits")
  })
  .strict();
export type ConfirmRegisterInput = z.infer<typeof ConfirmRegisterSchema>;

/** ─── RESEND CONFIRM CODE ───────────────────────────────────────────────── */
export const ResendConfirmCodeSchema = z
  .object({
    email: z.string().trim().email("Invalid email address")
  })
  .strict();
export type ResendConfirmCodeInput = z.infer<typeof ResendConfirmCodeSchema>;
