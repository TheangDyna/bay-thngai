// payment.controller.ts
import { PaymentService } from "@/src/services/payment.service";
import { Request, Response } from "express";

export class PaymentController {
  constructor(private service = new PaymentService()) {}

  public createTransaction = async (req: Request, res: Response) => {
    try {
      const { orderId, amount, items, customer } = req.body;
      const config = await this.service.purchaseTransaction({
        orderId,
        amount,
        items,
        customer
      });
      res.json(config);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Payment initialization failed" });
    }
  };
}
