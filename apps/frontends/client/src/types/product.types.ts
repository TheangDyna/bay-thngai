import { Discount } from "@/types/discount.types";
import { Cuisine } from "./cuisine.types";

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
  ratingsAverage: number;
  ratingsQuantity: number;
  sold: number;
  discount: Discount;
  createdAt: Date;
  updatedAt: Date;
}
