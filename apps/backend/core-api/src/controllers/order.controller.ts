import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { OrderService } from "../services/order.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class OrderController {
  private orderService = new OrderService();

  /**
   * POST /api/v1/orders
   * body: { cartId: string }
   */
  public createOrder = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user!.id;
      const { cartId } = req.body;
      if (!cartId) throw new Error("cartId is required");

      const order = await this.orderService.createOrderFromCart(userId, cartId);
      res.status(201).json({ status: "success", data: order });
    }
  );

  /**
   * GET /api/v1/orders
   * returns the logged-in user’s orders
   */
  public getMyOrders = catchAsync(async (req: AuthenticatedRequest, res) => {
    const userId = req.user!.id;
    const orders = await this.orderService.getBy({ user: userId });
    res.status(200).json({ status: "success", data: orders });
  });

  /**
   * GET /api/v1/orders/:id
   * returns one order (if it belongs to the user)
   */
  public getOrder = catchAsync(async (req: AuthenticatedRequest, res) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const order = await this.orderService.getOne(id);
    if (!order || order.user.toString() !== userId)
      throw new Error("Order not found");
    res.status(200).json({ status: "success", data: order });
  });
}
