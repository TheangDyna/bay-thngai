import { Document } from "mongoose";
import { z } from "zod";
import { ProductSchema } from "../validators/product.validators";

export type IProduct = z.infer<typeof ProductSchema>;

export interface IProductDocument extends IProduct, Document {
  createdAt: Date;
  updatedAt: Date;
}
