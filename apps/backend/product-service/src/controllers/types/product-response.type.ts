import { IProduct } from "@/src/database/models/product.model";

export interface ProductPaginatedResponse {
  message: string;
  data: {
    [key: string]: IProduct[] | number;
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface ProductResponse {
  message: string;
  data: IProduct;
}
