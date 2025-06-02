import { z } from "zod";

export const placeOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.string().nonempty(),
          qty: z.number().int().positive(),
          price: z.number().nonnegative()
        })
      )
      .min(1),
    address: z.string().min(5),
    addressNotes: z.string().optional(),
    label: z.enum(["Home", "Work", "Partner", "Other"]).optional(),
    contactless: z.boolean(),
    deliveryOption: z.enum(["standard", "priority"]),
    paymentMethod: z.enum(["cod", "card", "aba"]),
    tip: z.number().min(0)
  })
});
