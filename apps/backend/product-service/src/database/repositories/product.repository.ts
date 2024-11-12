import ProductModel, { IProduct } from "@/src/database/models/product.model";
import {
  ProductCreateRequest,
  ProductUpdateRequest
} from "@/src/controllers/types/product-request.type";
import {
  ProductGetAllRepoParams,
  ProductSortParams
} from "./types/product-repository.type";
import { SortOrder } from "mongoose";
import { NotFoundError } from "@/src/utils/errors";

class ProductRepository {
  public async dynamicQuery(aiGeneratedInstructions: any): Promise<any> {
    try {
      // Extract query details from AI-generated instructions
      const { operation, query = {}, options = {} } = aiGeneratedInstructions;

      // Cast operation to ensure it's a valid Mongoose method
      const mongooseQuery = (ProductModel as any)[operation](query); // Type assertion to 'any'

      // Apply additional methods like limit, sort, etc.
      let finalQuery = mongooseQuery;

      // Apply additional methods like limit, sort, etc.
      if (options.sort) finalQuery = mongooseQuery.sort(options.sort);

      if (options.limit) finalQuery = mongooseQuery.limit(options.limit);

      if (options.select) finalQuery = mongooseQuery.select(options.select);

      if (options.skip) finalQuery = mongooseQuery.skip(options.skip);

      // Execute the built query
      const result = await finalQuery.exec();

      return result;
    } catch (error) {
      console.error(
        `ProductRepository - dynamicQuery() method error: ${error}`
      );
      throw error;
    }
  }

  async getAll(queries: ProductGetAllRepoParams): Promise<any> {
    const {
      page = 1,
      limit = 10,
      filter = {},
      sort = { name: "desc" }
    } = queries;

    // Convert sort from {'field': 'desc'} to {'field': -1}
    const sortFields = Object.keys(sort).reduce(
      (acc, key) => {
        const direction = sort[key as keyof ProductSortParams];
        if (direction === "asc" || direction === "desc") {
          acc[key as keyof ProductSortParams] = direction === "asc" ? 1 : -1;
        }
        return acc;
      },
      {} as Record<keyof ProductSortParams, SortOrder>
    );

    // Build MongoDB filter object
    const buildFilter = (filter: Record<string, any>) => {
      const mongoFilter: Record<string, any> = {};
      for (const key in filter) {
        if (typeof filter[key] === "object") {
          if (
            filter[key].hasOwnProperty("min") ||
            filter[key].hasOwnProperty("max")
          ) {
            mongoFilter[key] = {};
            if (filter[key].min !== undefined) {
              mongoFilter[key].$gte = filter[key].min;
            }
            if (filter[key].max !== undefined) {
              mongoFilter[key].$lte = filter[key].max;
            }
          } else {
            mongoFilter[key] = filter[key];
          }
        } else {
          mongoFilter[key] = filter[key];
        }
      }
      return mongoFilter;
    };

    try {
      const mongoFilter = buildFilter(filter);
      const operation = ProductModel.find(mongoFilter)
        .sort(sortFields)
        .skip((page - 1) * limit)
        .limit(limit);

      const result = await operation;
      const totalItems = await ProductModel.countDocuments(mongoFilter);

      return {
        [ProductModel.collection.collectionName]: result,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
      };
    } catch (error) {
      console.error(`ProductRepository - getAll() method error: ${error}`);
      throw error;
    }
  }

  public async createProduct(
    productRequest: ProductCreateRequest
  ): Promise<IProduct> {
    try {
      const newProduct = await ProductModel.create(productRequest);
      return newProduct;
    } catch (error) {
      console.error(
        `ProductRepository - createProduct() method error: ${error}`
      );
      throw error;
    }
  }

  public async getProductById(productId: string): Promise<IProduct> {
    try {
      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new NotFoundError("Product not found!");
      }

      return product;
    } catch (error) {
      console.error(
        `ProductRepository - getProductById() method error: ${error}`
      );
      throw error;
    }
  }

  public async updateProductById(
    productId: string,
    productRequest: ProductUpdateRequest
  ): Promise<IProduct> {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        productRequest,
        { new: true }
      );

      if (!updatedProduct) {
        throw new NotFoundError("Product not found!");
      }

      return updatedProduct;
    } catch (error) {
      console.error(
        `ProductRepository - updateProductById() method error: ${error}`
      );
      throw error;
    }
  }

  public async deleteProductById(productId: string): Promise<void> {
    try {
      const deleteProduct = await ProductModel.findByIdAndDelete(productId);

      if (!deleteProduct) {
        throw new NotFoundError("Product not found!");
      }
    } catch (error) {
      console.error(
        `ProductRepository - deleteProductById() method error: ${error}`
      );
      throw error;
    }
  }
}

// Add more repository methods as needed
export default new ProductRepository();
