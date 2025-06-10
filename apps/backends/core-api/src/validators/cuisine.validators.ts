import { z } from "zod";

export const CuisineSchema = z
  .object({
    name: z.string().trim().min(1),
    description: z.string().trim().min(1),
    thumbnail: z.string().url().min(1)
  })
  .strict();

export const CreateCuisineSchema = CuisineSchema;
export const UpdateCuisineSchema = CuisineSchema.partial();
