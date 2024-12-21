import { Document } from "mongoose";
import { z } from "zod";
import {
  CreateProductSchema,
  ProductSchema,
  UpdateProductSchema
} from "../validators/product.validators";

export type IProduct = z.infer<typeof ProductSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

export interface IProductDocument extends IProduct, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductResponse {
  status: string;
  data: IProductDocument;
}

export interface ProductsResponse {
  status: string;
  results: number;
  data: IProductDocument[];
}
