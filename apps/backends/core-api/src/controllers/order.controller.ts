import OrderService from "@/src/services/order.service";
import { catchAsync } from "@/src/utils/catchAsync";
import { Request, Response } from "express";

export default class OrderController {
  private service = new OrderService();

  public create = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const result = await this.service.create(req.body);
      res.json(result);
    }
  );
}
