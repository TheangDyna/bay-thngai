import {
  ProductCreateRequest,
  ProductGetAllRequest,
  ProductUpdateRequest,
} from "@/src/controllers/types/product-request.type";
import { IItem } from "@/src/database/models/product.model";
import ProductRepository from "../database/repositories/product.repository";

export class ProductService {
  public async getAllProducts(queries: ProductGetAllRequest) {
    try {
      const { page, limit, filter, sort } = queries;

      const newQueries = {
        page,
        limit,
        filter: filter && JSON.parse(filter),
        sort: sort && JSON.parse(sort),
      };
      const result = await ProductRepository.getAll(newQueries);

      return result;
    } catch (error) {
      console.error(`ProductService - getAllProducts() method error: ${error}`);
      throw error;
    }
  }

  public async createProduct(
    productRequest: ProductCreateRequest
  ): Promise<IItem> {
    try {
      const newProduct = await ProductRepository.createProduct(productRequest);
      return newProduct;
    } catch (error) {
      console.error(`ProductService - createProduct() method error: ${error}`);
      throw error;
    }
  }

  public async getProductById(productId: string): Promise<IItem> {
    try {
      const product = await ProductRepository.getProductById(productId);
      return product;
    } catch (error) {
      console.error(`ProductService - getProductById() method error: ${error}`);
      throw error;
    }
  }

  public async updateProductById(
    productId: string,
    productRequest: ProductUpdateRequest
  ): Promise<IItem> {
    try {
      const updatedProduct = await ProductRepository.updateProductById(
        productId,
        productRequest
      );
      return updatedProduct;
    } catch (error) {
      console.error(
        `ProductService - updateProductById() method error: ${error}`
      );
      throw error;
    }
  }

  public async deleteProductById(id: string): Promise<void> {
    try {
      await ProductRepository.deleteProductById(id);
    } catch (error) {
      console.error(
        `ProductService - deleteProductById() method error: ${error}`
      );
      throw error;
    }
  }
}

export default new ProductService();
