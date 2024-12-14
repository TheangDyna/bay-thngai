import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { UserService } from "../services/user.service";

export class UserController {
  public static getAllUsers = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const users = await UserService.getAllUsers(req.query);
      res.status(200).json({
        status: "success",
        results: users.length,
        data: users
      });
    }
  );

  public static getUser = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = await UserService.getUserById(req.params.id);
      res.status(200).json({
        status: "success",
        data: user
      });
    }
  );

  // public static createProduct = catchAsync(
  //   async (req: Request, res: Response): Promise<void> => {
  //     const productData: ProductCreateInput = req.body;
  //     const product = await ProductService.createProduct(productData);
  //     res.status(201).json({
  //       status: "success",
  //       data: product
  //     });
  //   }
  // );

  // public static updateProduct = catchAsync(
  //   async (req: Request, res: Response): Promise<void> => {
  //     const productData: ProductUpdateInput = req.body;
  //     const product = await ProductService.updateProduct(
  //       req.params.id,
  //       productData
  //     );
  //     res.status(200).json({
  //       status: "success",
  //       data: product
  //     });
  //   }
  // );

  // public static deleteProduct = catchAsync(
  //   async (req: Request, res: Response): Promise<void> => {
  //     await ProductService.deleteProduct(req.params.id);
  //     res.status(204).json({
  //       status: "success",
  //       data: null
  //     });
  //   }
  // );
}
