import { Document } from "mongoose";
import { z } from "zod";
import { CartProductSchema, CartSchema } from "../validators/cart.validators";

export type ICartProduct = z.infer<typeof CartProductSchema>;
export type ICart = z.infer<typeof CartSchema>;

export interface ICartDocument extends ICart, Document {
  createdAt: Date;
  updatedAt: Date;
}
