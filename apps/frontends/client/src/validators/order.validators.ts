import { z } from "zod";

export const CreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().nonempty("Product ID is required"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
        price: z.number().min(0, "Price cannot be negative")
      })
    )
    .min(1, "Cart cannot be empty"),
  customer: z.object({
    phone: z.string().min(7, "Phone number must be at least 7 digits")
  }),
  shipping: z.number().min(0, "Shipping fee cannot be negative"),
  tip: z.number().min(0, "Tip cannot be negative"),
  paymentMethod: z.enum(["abapay_khqr", "cards", "cod"], {
    errorMap: () => ({ message: "Payment method is required" })
  }),
  deliveryAddress: z.object({
    type: z.literal("Point"),
    coordinates: z
      .tuple([z.number(), z.number()], {
        errorMap: () => ({ message: "Valid coordinates are required" })
      })
      .refine(([lng, lat]) => !isNaN(lng) && !isNaN(lat), {
        message: "Coordinates must be valid numbers"
      }),
    address: z.string().optional()
  }),
  deliveryTimeSlot: z.string().nonempty("Delivery time slot is required"),
  instructions: z.string().optional(),
  leaveAtDoor: z.boolean()
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
