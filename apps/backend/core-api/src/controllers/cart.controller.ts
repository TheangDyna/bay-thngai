import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { CartService } from "../services/cart.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { AppError } from "../utils/appError";

export class CartController {
  private cartService = new CartService();

  public getCart = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("You do not have permission to view the cart.", 403);
      }

      const cart = await this.cartService.getCartByUser(userId);
      res.status(200).json({
        status: "success",
        data: cart
      });
    }
  );

  public addToCart = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(
          "You do not have permission to add items to the cart.",
          403
        );
      }

      const { productId, quantity } = req.body;
      const items = await this.cartService.addToCart(
        userId,
        productId,
        quantity
      );

      res.status(201).json({
        status: "success",
        data: items
      });
    }
  );

  public removeFromCart = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(
          "You do not have permission to remove items from the cart.",
          403
        );
      }

      const { productId } = req.params;
      const items = await this.cartService.removeFromCart(userId, productId);

      res.status(200).json({
        status: "success",
        data: items
      });
    }
  );

  public clearCart = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(
          "You do not have permission to clear the cart.",
          403
        );
      }

      await this.cartService.clearCart(userId);
      res.status(204).send();
    }
  );
}
