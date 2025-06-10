import { z } from "zod";

export const CuisineSchema = z
  .object({
    name: z.string().trim().min(1, "Cuisine Name is required"),
    description: z.string().trim().min(1, "Description is required"),
    thumbnail: z.union([
      z.instanceof(File, { message: "Thumbnail is required." }),
      z.string().url({ message: "Thumbnail is required." })
    ])
  })
  .strict();

export const cuisineDefaultValues = {
  name: "",
  description: "",
  thumbnail: undefined
};
