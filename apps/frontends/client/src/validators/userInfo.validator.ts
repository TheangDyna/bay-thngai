import { z } from "zod";

export const UpdateInfoSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    age: z
      .union([
        z.string().trim().min(1, "Age is required."),
        z.number().int().min(0, "Age must be a positive integer.")
      ])
      .optional(),
    gender: z.string().optional(),
    height: z
      .union([
        z.string().trim().min(1, "Height is required."),
        z.number().min(0, "Height must be a positive number.")
      ])
      .optional(),
    weight: z
      .union([
        z.string().trim().min(1, "Weight is required."),
        z.number().min(0, "Weight must be a positive number.")
      ])
      .optional(),
    activityLevel: z.string().optional(),
    dietaryPreferences: z.array(z.string()).optional(),
    healthGoals: z.string().optional(),
    allergies: z.array(z.string()).optional(),
    dailyCalorieTarget: z
      .union([
        z.string().trim().min(1, "Daily calorie target is required."),
        z.number().min(0, "Daily calorie target must be a positive number.")
      ])
      .optional()
  })
  .strict();
