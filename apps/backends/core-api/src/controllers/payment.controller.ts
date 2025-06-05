// src/controllers/payment.controller.ts
import { OrderRepository } from "@/src/repositories/order.repository";
import { PaymentService, PurchaseParams } from "@/src/services/payment.service";
import { Request, Response } from "express";

export class PaymentController {
  private service = new PaymentService();
  private orderRepo = new OrderRepository();

  /**
   * POST /api/payment/purchase
   * Expects: { tranId, amount, shipping, items, customer }
   * Returns: { endpoint, payload }
   */
  public createTransaction = async (req: Request, res: Response) => {
    try {
      const params = req.body as PurchaseParams;
      // You could also do validation here (e.g. ensure fields exist).
      const paymentConfig = await this.service.purchaseTransaction(params);
      return res.json(paymentConfig);
    } catch (err: any) {
      console.error("PaymentController.createTransaction error:", err);
      return res.status(500).json({ error: "Failed to initialize payment." });
    }
  };

  /**
   * POST /api/payment/callback
   * PayWay hits this URL with JSON after a transaction is complete.
   * We verify the HMAC, then update the order’s status.
   */
  public handleCallback = async (req: Request, res: Response) => {
    console.log(req);

    const payload = req.body;

    const tranId: string = payload.tran_id;

    if (!tranId) {
      console.error(
        "❌ PayWay callback missing tran_id and return_params does not contain it.",
        { payload }
      );
      return res.status(400).send("Missing tran_id");
    }

    try {
      const status = await this.service.checkTransaction(tranId);

      if (status) {
        await this.orderRepo.updateStatus(tranId, status);
        console.log(
          `✅ Order ${tranId} marked as ${status} (verified via check-transaction).`
        );
      }

      return res.status(200).send("OK");
    } catch (err: any) {
      console.error("❌ Error during check-transaction or DB update:", err);
      return res.status(500).send("Server error");
    }
  };
}
