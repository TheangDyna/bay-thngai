import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().positive().min(1),
  description: z.string().min(10),
  cuisines: z.array(z.string().min(1)).min(1),
  dietaries: z.array(z.string().min(1)).optional(),
  inStock: z.boolean().default(true),
  calories: z.number().positive().optional(),
  protein: z.number().positive().optional(),
  carbs: z.number().positive().optional(),
  fats: z.number().positive().optional(),
  ingredients: z.array(z.string().min(1)).optional(),
  thumbnail: z.instanceof(File).optional(),
  images: z.array(z.instanceof(File)).optional()
});

export const ProductDefaultValue = {
  name: "",
  description: "",
  price: 0,
  inStock: true
};
