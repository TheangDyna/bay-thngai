import { z } from "zod";

export const CuisineSchema = z
  .object({
    name: z.string().trim().min(1, "Cuisine Name is required"),
    description: z.string().trim().min(1, "Description is required")
  })
  .strict();

export const cuisineDefaultValues = {
  name: "",
  description: ""
};
