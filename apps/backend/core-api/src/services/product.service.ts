import { Product } from "../models/product.model";
import { FactoryRepository } from "../repositories/factory.repository";
import {
  IProductDocument,
  ProductCreateInput,
  ProductUpdateInput
} from "../types/product.types";

export class ProductService {
  public static async getAllProducts(
    queryString: Record<string, any>
  ): Promise<IProductDocument[]> {
    return await FactoryRepository.getAll(Product, queryString);
  }

  public static async getProductById(id: string): Promise<IProductDocument> {
    return await FactoryRepository.getOne(Product, id);
  }

  public static async createProduct(
    data: ProductCreateInput
  ): Promise<IProductDocument> {
    return await FactoryRepository.createOne(Product, data);
  }

  public static async updateProduct(
    id: string,
    data: ProductUpdateInput
  ): Promise<IProductDocument> {
    return await FactoryRepository.updateOne(Product, id, data);
  }

  public static async deleteProduct(id: string): Promise<void> {
    return await FactoryRepository.deleteOne(Product, id);
  }
}
