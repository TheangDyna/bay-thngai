import { Request, Response } from "express";
import { OrderService } from "../services/order.service";

export class OrderController {
  constructor(private service = new OrderService()) {}

  async placeOrder(req: Request, res: Response) {
    const userId = req.user.id;
    const order = await this.service.placeOrder(userId, req.body);
    res.status(201).json({ status: "success", data: order });
  }
}
