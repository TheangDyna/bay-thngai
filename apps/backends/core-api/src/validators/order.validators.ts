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
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().min(7)
  }),
  shipping: z.number().min(0),
  tip: z.number().min(0),
  paymentMethod: z.enum(["abapay_khqr", "cards", "cod"]),
  deliveryAddress: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
    address: z.string().trim().optional()
  }),
  deliveryTimeSlot: z.string(),
  instructions: z.string(),
  leaveAtDoor: z.boolean()
});
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
