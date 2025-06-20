import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z.string().email().trim(),
    password: z.string().min(6).trim()
  })
  .strict();

export const ResendConfirmCodeSchema = z
  .object({
    email: z.string().email().trim()
  })
  .strict();

export const ConfirmRegisterSchema = z
  .object({
    email: z.string().trim().email(),
    code: z.string().trim().length(6)
  })
  .strict();

export const LoginSchema = z
  .object({
    email: z.string().min(1),
    password: z.string().min(1)
  })
  .strict();

export const ForgotPasswordSchema = z
  .object({
    email: z.string().trim().email()
  })
  .strict();

export const ResetPasswordSchema = z
  .object({
    email: z.string().trim(),
    code: z.string().trim().length(6),
    newPassword: z.string().trim().min(6)
  })
  .strict();

export const UpdateInfoSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    age: z.number().int().optional(),
    gender: z.string().optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
    activityLevel: z.string().optional(),
    dietaryPreferences: z.array(z.string()).optional(),
    healthGoals: z.string().optional(),
    allergies: z.array(z.string()).optional(),
    dailyCalorieTarget: z.number().optional()
  })
  .strict();
