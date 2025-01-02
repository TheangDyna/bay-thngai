import { z } from "zod";
import { ObjectIdSchema } from "../utils/objectIdSchema";
import { CartProductSchema } from "./cart.validators";

export const OrderStatusSchema = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered"
]);

export const OrderSchema = z
  .object({
    user: ObjectIdSchema,
    products: z.array(CartProductSchema).min(1),
    total: z.number().positive(),
    status: OrderStatusSchema.optional().default("pending"),
    shippingAddress: z.object({
      coordinates: z.array(z.number()).min(2)
    })
  })
  .strict();

export const CreateOrderSchema = OrderSchema;
export const UpdateOrderSchema = OrderSchema.partial();
