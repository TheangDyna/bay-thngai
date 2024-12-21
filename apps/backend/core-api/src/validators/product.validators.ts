import { z } from "zod";
import { objectIdSchema } from "../utils/objectIdSchema";

export const ProductSchema = z.object({
  name: z.string().min(1).trim(),
  description: z.string().min(1).trim(),
  price: z.number().min(0),
  cuisines: z.array(objectIdSchema),
  dietaries: z.array(objectIdSchema).optional().default([]),
  inStock: z.boolean().optional().default(true),
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fats: z.number().optional(),
  ingredients: z.array(z.string()).optional().default([])
});

export const CreateProductSchema = ProductSchema;
export const UpdateProductSchema = ProductSchema.partial();
