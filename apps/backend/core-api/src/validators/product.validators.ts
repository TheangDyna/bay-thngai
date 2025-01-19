import { z } from "zod";
import { ObjectIdSchema } from "../utils/objectIdSchema";

export const ProductSchema = z
  .object({
    name: z.string().trim().min(1),
    description: z.string().trim().min(1),
    price: z.number().min(1),
    thumbnail: z.string().url().min(1),
    cuisines: z.array(ObjectIdSchema).min(1),
    dietaries: z.array(ObjectIdSchema).optional().default([]),
    inStock: z.boolean().optional().default(true),
    calories: z.number().min(0).optional(),
    protein: z.number().min(0).optional(),
    carbs: z.number().min(0).optional(),
    fats: z.number().min(0).optional(),
    ingredients: z.array(z.string().trim().min(1)).optional().default([]),
    ratingsAverage: z.number().positive().optional(),
    ratingsQuantity: z.number().int().positive().optional(),
    images: z.array(z.string().url().min(1)).optional().default([])
  })
  .strict();

export const CreateProductSchema = ProductSchema;
export const UpdateProductSchema = ProductSchema.partial();
