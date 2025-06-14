import PaymentService from "@/src/services/payment.service";
import { catchAsync } from "@/src/utils/catchAsync";
import { Request, Response } from "express";

export default class PaymentController {
  private paymentService = new PaymentService();

  public getCallback = catchAsync(async (_req: Request, res: Response) => {
    res.sendStatus(200);
  });

  public callback = catchAsync(async (req: Request, res: Response) => {
    await this.paymentService.handleCallback(req.body);
    res.sendStatus(200);
  });
}
