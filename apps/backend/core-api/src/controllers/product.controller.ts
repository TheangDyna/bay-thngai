import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { catchAsync } from "../utils/catchAsync";
import { ProductCreateInput, ProductUpdateInput } from "../types/product.types";

export class ProductController {
  public static getAllProducts = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const products = await ProductService.getAllProducts(req.query);
      res.status(200).json({
        status: "success",
        results: products.length,
        data: products
      });
    }
  );

  public static getProduct = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const product = await ProductService.getProductById(req.params.id);
      res.status(200).json({
        status: "success",
        data: product
      });
    }
  );

  public static createProduct = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const productData: ProductCreateInput = req.body;
      const product = await ProductService.createProduct(productData);
      res.status(201).json({
        status: "success",
        data: product
      });
    }
  );

  public static updateProduct = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const productData: ProductUpdateInput = req.body;
      const product = await ProductService.updateProduct(
        req.params.id,
        productData
      );
      res.status(200).json({
        status: "success",
        data: product
      });
    }
  );

  public static deleteProduct = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await ProductService.deleteProduct(req.params.id);
      res.status(204).json({
        status: "success",
        data: null
      });
    }
  );
}
