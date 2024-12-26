import { z } from "zod";
import { objectIdSchema } from "../utils/objectIdSchema";

export const CartProductSchema = z
  .object({
    productId: objectIdSchema,
    quantity: z.number().min(1)
  })
  .strict();

export const CartSchema = z
  .object({
    user: objectIdSchema,
    products: z.array(CartProductSchema).min(1)
  })
  .strict();

export const CreateCartSchema = CartSchema;
export const UpdateCartSchema = CartSchema.partial();
