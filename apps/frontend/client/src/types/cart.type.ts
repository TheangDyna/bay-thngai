import { Product } from "@/types/product.types";

export type CartItme = {
  product: Product;
  quantity: number;
};

export type ICart = {
  quantity: string;
  product: CartItme[];
};
