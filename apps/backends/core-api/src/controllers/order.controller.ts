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
}
