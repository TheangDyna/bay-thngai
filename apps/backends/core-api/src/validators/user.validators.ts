import { z } from "zod";

export const UserRoleSchema = z.enum(["user", "admin"]);
export const GenderSchema = z.enum(["male", "female"]);
export const ActivityLevelSchema = z.enum([
  "sedentary",
  "lightly active",
  "moderately active",
  "very active",
  "extra active"
]);
export const DietaryPreferencesSchema = z.enum([
  "vegetarian",
  "vegan",
  "gluten-free",
  "low-carb",
  "high-protein",
  "halal",
  "kosher"
]);
export const HealthGoalsSchema = z.enum([
  "weight loss",
  "weight gain",
  "maintenance",
  "muscle gain",
  "improved health"
]);

export const AddressSchema = z.object({
  label: z.string().trim().min(1),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
    address: z.string().trim().optional()
  })
});

export const UserSchema = z
  .object({
    email: z.string().trim().email(),
    cognitoId: z.string().trim(),
    role: UserRoleSchema.optional().default("user"),
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    age: z.number().int().min(1).max(120).optional(),
    gender: GenderSchema.optional(),
    height: z.number().min(50).optional(),
    weight: z.number().min(20).optional(),
    activityLevel: ActivityLevelSchema.optional().default("moderately active"),
    dietaryPreferences: z
      .array(DietaryPreferencesSchema)
      .optional()
      .default([]),
    healthGoals: HealthGoalsSchema.optional().default("maintenance"),
    allergies: z.array(z.string().trim().min(1)).optional().default([]),
    dailyCalorieTarget: z.number().positive().optional().default(2000),
    addresses: z.array(AddressSchema).optional().default([])
  })
  .strict();

export const CreateUserSchema = UserSchema;
export const UpdateUserSchema = UserSchema.partial();
