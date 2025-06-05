// src/controllers/payment.controller.ts
import { PaymentService } from "@/src/services/payment.service";
import { generateTranId } from "@/src/utils/generateTranId";
import { Request, Response } from "express";

export class PaymentController {
  constructor(private service = new PaymentService()) {}

  public createTransaction = async (req: Request, res: Response) => {
    try {
      const tranId = generateTranId();
      const { amount, items, customer } = req.body;

      // 1) Basic validation: make sure nothing is undefined/null
      if (
        !tranId ||
        typeof amount !== "number" ||
        !Array.isArray(items) ||
        items.length === 0 ||
        typeof customer !== "object" ||
        !customer.firstName ||
        !customer.lastName
      ) {
        return res.status(400).json({
          error:
            "Missing or invalid parameters. Required: orderId (string), amount (number), items (non-empty array), customer.{firstName, lastName} (strings)."
        });
      }

      // 2) Call service
      const config = await this.service.purchaseTransaction({
        tranId,
        amount,
        items,
        customer
      });

      return res.json(config);
    } catch (err: any) {
      console.error("PaymentController.createTransaction error:", err);
      return res.status(500).json({ error: "Payment initialization failed" });
    }
  };
}
