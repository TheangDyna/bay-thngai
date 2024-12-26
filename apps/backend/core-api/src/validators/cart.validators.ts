import { z } from "zod";
import { ObjectIdSchema } from "../utils/objectIdSchema";

export const CartProductSchema = z
  .object({
    productId: ObjectIdSchema,
    quantity: z.number().min(1)
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
