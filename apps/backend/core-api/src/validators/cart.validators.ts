import { z } from "zod";
import { ObjectIdSchema } from "../utils/objectIdSchema";

export const CartProductSchema = z
  .object({
    product: ObjectIdSchema,
    quantity: z.number().int().min(1)
  })
  .strict();

export const CartSchema = z
  .object({
    user: ObjectIdSchema,
    products: z.array(CartProductSchema).min(1)
  })
  .strict();

export const CreateCartSchema = CartSchema;
export const UpdateCartSchema = CartSchema.partial();
