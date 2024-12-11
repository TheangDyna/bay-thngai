import { Document } from "mongoose";
import { z } from "zod";
import {
  CreateProductSchema,
  UpdateProductSchema
} from "../validators/product.validators";

export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

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

export type ProductCreateInput = z.infer<typeof CreateProductSchema>;
export type ProductUpdateInput = z.infer<typeof UpdateProductSchema>;
