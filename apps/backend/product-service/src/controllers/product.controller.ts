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
  Controller
} from "tsoa";
import {
  ProductCreateRequest,
  ProductGetAllRequest,
  ProductUpdateRequest
} from "@/src/controllers/types/product-request.type";
import { IItem } from "@/src/database/models/product.model";
import ProductService from "@/src/services/product.service";
import {
  ProductPaginatedResponse,
  ProductResponse
} from "./types/product-response.type";

@Route("v1/products")
export class ProductController extends Controller {
  @Get("/health")
  public async getHealth(): Promise<{ message: string }> {
    try {
      return { message: "OK" };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  public async getAllProducts(
    @Queries() queries: ProductGetAllRequest
  ): Promise<ProductPaginatedResponse> {
    try {
      const response = await ProductService.getAllProducts(queries);

      return {
        message: "success",
        data: response
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
  public async createProduct(
    @Body() requestBody: ProductCreateRequest
  ): Promise<IItem> {
    try {
      const newProduct = await ProductService.createProduct(requestBody);

      return {
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price
      };
    } catch (error) {
      console.error(
        `ProductsController - createProduct() method error: ${error}`
      );
      throw error;
    }
  }

  @Get("{productId}")
  public async getProductById(
    @Path() productId: string
  ): Promise<ProductResponse> {
    try {
      const product = await ProductService.getProductById(productId);
      return {
        message: "success",
        data: product
      };
    } catch (error) {
      console.error(
        `ProductsController - getProductById() method error: ${error}`
      );
      throw error;
    }
  }

  @Put("{productId}")
  public async updateProductById(
    @Path() productId: string,
    @Body() requestBody: ProductUpdateRequest
  ): Promise<ProductResponse> {
    try {
      const updatedProduct = await ProductService.updateProductById(
        productId,
        requestBody
      );

      return { message: "success", data: updatedProduct };
    } catch (error) {
      console.error(
        `ProductsController - updateProductById() method error: ${error}`
      );
      throw error;
    }
  }

  @SuccessResponse(204, "Delete Success")
  @Delete("{productId}")
  public async deleteProductById(@Path() productId: string): Promise<void> {
    try {
      await ProductService.deleteProductById(productId);
    } catch (error) {
      console.error(
        `ProductsController - deleteProductById() method error: ${error}`
      );
      throw error;
    }
  }
}
