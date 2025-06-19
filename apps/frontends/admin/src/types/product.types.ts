import { z } from "zod";
import { ProductSchema } from "../validators/product.validators";
import { Cuisine } from "./cuisine.types";

export type ProductInput = z.infer<typeof ProductSchema>;

export interface Product {
  _id: string;
  name: string;
  price: number;
  inStock: boolean;
  description: string;
  cuisines: Cuisine[];
  dietaries?: string[];
  ingredients?: string[];
  thumbnail: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
