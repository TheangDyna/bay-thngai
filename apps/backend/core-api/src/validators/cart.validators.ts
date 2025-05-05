import { ObjectIdSchema } from "@/src/utils/objectIdSchema";
import { z } from "zod";

export const CartItemSchema = z.object({
  product: ObjectIdSchema,
  quantity: z.number().int().min(1)
});

export const CartSchema = z.object({
  user: ObjectIdSchema,
  items: z.array(CartItemSchema)
});

export const AddToCartSchema = z.object({
  productId: ObjectIdSchema,
  quantity: z.number().int().default(1)
});
