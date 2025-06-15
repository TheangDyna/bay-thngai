import OrderService from "@/src/services/order.service";
import { catchAsync } from "@/src/utils/catchAsync";
import { Request, Response } from "express";

export default class OrderController {
  private service = new OrderService();

  public create = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      req.body.customer.email = req.user.email;
      req.body.customer.firstName = req.user.firstName || "";
      req.body.customer.lastName = req.user.lastName || "";
      const result = await this.service.create(req.body);
      res.json(result);
    }
  );

  public getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const { total, orders } = await this.service.getAllOrders(req.query);
    res.status(200).json({
      status: "success",
      total,
      results: orders.length,
      data: orders
    });
  });

  public getOrderByTranId = catchAsync(async (req: Request, res: Response) => {
    const { tranId } = req.params;
    const order = await this.service.getOrderByTranId(tranId);
    res.status(200).json(order);
  });

  public updateDeliveryStatus = catchAsync(
    async (req: Request, res: Response) => {
      const { orderId } = req.params;
      const { status } = req.body;
      const order = await this.service.updateDeliveryStatus(orderId, status);
      res.status(200).json({
        status: "success",
        data: order
      });
    }
  );
}
