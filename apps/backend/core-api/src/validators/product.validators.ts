import { z } from "zod";
import { ObjectIdSchema } from "../utils/objectIdSchema";

export const ProductSchema = z
  .object({
    name: z.string().trim().min(1),
    description: z.string().trim().min(1),
    price: z.number().min(1),
    cuisines: z.array(ObjectIdSchema).min(1),
    dietaries: z.array(ObjectIdSchema).optional().default([]),
    inStock: z.boolean().optional().default(true),
    calories: z.number().positive().optional(),
    protein: z.number().positive().optional(),
    carbs: z.number().positive().optional(),
    fats: z.number().positive().optional(),
    ingredients: z.array(z.string().trim().min(1)).optional().default([]),
    ratingsAverage: z.number().positive().optional().default(4.5),
    ratingsQuantity: z.number().int().positive().optional().default(0)
  })
  .strict();

export const CreateProductSchema = ProductSchema;
export const UpdateProductSchema = ProductSchema.partial();
