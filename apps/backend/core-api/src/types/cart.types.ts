import { Document } from "mongoose";
import { z } from "zod";
import { CartItemSchema, CartSchema } from "@/src/validators/cart.validators";

export type ICart = z.infer<typeof CartSchema>;

export type ICartItem = z.infer<typeof CartItemSchema>;

export interface ICartDocument extends ICart, Document {
  createdAt: Date;
  updatedAt: Date;
}
