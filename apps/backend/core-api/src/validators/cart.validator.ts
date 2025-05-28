// src/validators/cart.validator.ts
import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().nonempty(),
  qty: z.number().int().positive()
});

export const updateCartItemSchema = z.object({
  productId: z.string().nonempty(),
  qty: z.number().int().positive()
});

export const removeCartItemSchema = z.object({
  params: z.object({
    productId: z.string().nonempty()
  })
});
