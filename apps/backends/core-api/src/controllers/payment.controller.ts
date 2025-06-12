import OrderService from "@/src/services/order.service";
import { catchAsync } from "@/src/utils/catchAsync";
import { Request, Response } from "express";

export default class PaymentController {
  private orderService = new OrderService();

  public getCallback = catchAsync(async (_req: Request, res: Response) => {
    res.sendStatus(200);
  });

  public callback = catchAsync(async (req: Request, res: Response) => {
    await this.orderService.handleCallback(req.body);
    res.sendStatus(200);
  });
}
