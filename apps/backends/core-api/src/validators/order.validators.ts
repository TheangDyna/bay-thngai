import { z } from "zod";

export const CreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().nonempty(),
        quantity: z.number().int().min(1),
        price: z.number().min(0)
      })
    )
    .min(1),
  customer: z.object({
    firstName: z.string().nonempty(),
    lastName: z.string().nonempty(),
    email: z.string().email(),
    phone: z.string().min(7)
  }),
  shipping: z.number().min(0),
  tip: z.number().min(0).optional(),
  paymentMethod: z.enum(["khqr", "card", "cod"]),
  deliveryAddressId: z.string().nonempty(),
  deliveryTimeSlot: z.string().nonempty(),
  instructions: z.string().optional()
});
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
