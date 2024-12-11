import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  description: z.string().min(1, "Description is required").trim(),
  price: z.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required").trim(),
  inStock: z.boolean().optional()
});

export const CreateProductSchema = ProductSchema;
export const UpdateProductSchema = ProductSchema.partial();
