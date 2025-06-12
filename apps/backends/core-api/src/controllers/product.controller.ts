import { ProductService } from "@/src/services/product.service";
import { catchAsync } from "@/src/utils/catchAsync";
import { Request, Response } from "express";

export class ProductController {
  private service: ProductService;

  constructor() {
    this.service = new ProductService();
  }

  public createProduct = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const product = await this.service.createProduct(req.body);
      res.status(201).json({
        status: "success",
        data: product
      });
    }
  );

  public getAllProducts = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { total, products } = await this.service.getAllProducts(req.query);
      res.status(200).json({
        status: "success",
        total,
        results: products.length,
        data: products
      });
    }
  );

  public getProductById = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const product = await this.service.getProductById(req.params.productId);
      res.status(200).json({
        status: "success",
        data: product
      });
    }
  );

  public updateProduct = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const product = await this.service.updateProduct(
        req.params.productId,
        req.body
      );
      res.status(200).json({
        status: "success",
        data: product
      });
    }
  );

  public deleteProduct = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await this.service.deleteProduct(req.params.productId);
      res.status(204).json();
    }
  );
}
