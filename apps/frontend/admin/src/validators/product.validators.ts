import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().trim().min(1, "Product name is required."),
  price: z.union([
    z.string().trim().min(1, "Price is required."),
    z.number().min(0, "Price must be a positive number.")
  ]),
  description: z.string().trim().min(1, "Description is required."),
  cuisines: z
    .array(z.string().trim().min(1, "Each cuisine must have a value."))
    .min(1, "At least one cuisine is required."),
  dietaries: z
    .array(z.string().trim().min(1, "Each dietary must have a value."))
    .optional(),
  inStock: z.boolean(),
  calories: z.number().min(0, "Calories must be a positive number.").optional(),
  protein: z.number().min(0, "Protein must be a positive number.").optional(),
  carbs: z.number().min(0, "Carbs must be a positive number.").optional(),
  fats: z.number().min(0, "Fats must be a positive number.").optional(),
  ingredients: z
    .array(z.string().trim().min(1, "Each ingredient must have a value."))
    .optional(),
  thumbnail: z.union([
    z.instanceof(File, { message: "Thumbnail is required." }),
    z.string().url({ message: "Thumbnail is required." })
  ]),
  images: z.array(z.union([z.instanceof(File), z.string().url()])).optional()

  // for update
  // thumbnail: z.union([z.instanceof(File), z.string().url()]),
  // images: z.array(z.union([z.instanceof(File), z.string().url()])).optional()
});

export const ProductDefaultValue = {
  name: "",
  price: "",
  description: "",
  cuisines: [],
  dietaries: [], // don't have field yet
  inStock: true,
  calories: undefined, // don't have field yet
  protein: undefined, // don't have field yet
  carbs: undefined, // don't have field yet
  fats: undefined, // don't have field yet
  ingredients: [], // don't have field yet
  thumbnail: undefined,
  images: []
};
