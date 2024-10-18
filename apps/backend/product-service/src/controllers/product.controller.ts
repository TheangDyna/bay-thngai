import {
  Route,
  Body,
  Post,
  Path,
  Get,
  Put,
  Delete,
  SuccessResponse,
  Queries,
  Controller,
} from "tsoa";
import {
  ProductCreateRequest,
  ProductGetAllRequest,
  ProductUpdateRequest,
} from "@/src/controllers/types/product-request.type";
import { IItem } from "@/src/database/models/product.model";
import ProductService from "@/src/services/product.service";
import {
  ProductPaginatedResponse,
  ProductResponse,
} from "./types/product-response.type";

@Route("v1/products")
export class ProductController extends Controller {
  @Get()
  public async getAllProducts(
    @Queries() queries: ProductGetAllRequest
  ): Promise<ProductPaginatedResponse> {
    try {
      const response = await ProductService.getAllProducts(queries);

      return {
        message: "success",
        data: response,
      };
    } catch (error) {
      console.error(
        `ProductsController - getAllProducts() method error: ${error}`
      );
      throw error;
    }
  }

  @SuccessResponse("201", "Created")
  @Post()
  public async createItem(
    @Body() requestBody: ProductCreateRequest
  ): Promise<IItem> {
    try {
      const newProduct = await ProductService.createProduct(requestBody);

      return {
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get("{id}")
  public async getItemById(@Path() id: string): Promise<ProductResponse> {
    try {
      const product = await ProductService.getProductById(id);
      return {
        message: "success",
        data: product,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put("{id}")
  public async updateItem(
    @Path() id: string,
    @Body() requestBody: ProductUpdateRequest
  ): Promise<ProductResponse> {
    try {
      const updatedProduct = await ProductService.updateProduct(
        id,
        requestBody
      );

      return { message: "success", data: updatedProduct };
    } catch (error) {
      throw error;
    }
  }

  @SuccessResponse(204, "Delete Success")
  @Delete("{id}")
  public async deleteItemById(@Path() id: string): Promise<void> {
    try {
      await ProductService.deleteProduct(id);
    } catch (error) {
      throw error;
    }
  }
}
