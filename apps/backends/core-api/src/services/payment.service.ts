import { OrderDoc } from "@/src/models/order.model";
import OrderRepository from "@/src/repositories/order.repository";
import { AppError } from "@/src/utils/appError";
import crypto from "crypto";

export interface PurchaseParams {
  tranId: string;
  amount: number;
  shipping: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  paymentMethod: "abapay_khqr" | "cards";
}
export interface PaymentConfig {
  endpoint: string;
  payload: Record<string, string>;
}

export default class PaymentService {
  private baseUrl = process.env.ABA_ENDPOINT!;
  private merchantId = process.env.ABA_MERCHANT_ID!;
  private publicKey = process.env.ABA_PUBLIC_KEY!;

  private orderRepository = new OrderRepository();

  private makeReqTime(): string {
    return new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  }

  private generateHash(fields: Record<string, string>): string {
    const keysInOrder = [
      "req_time",
      "merchant_id",
      "tran_id",
      "amount",
      "items",
      "shipping",
      "firstname",
      "lastname",
      "email",
      "phone",
      "type",
      "payment_option",
      "return_url",
      "cancel_url",
      "continue_success_url",
      "return_deeplink",
      "currency",
      "custom_fields",
      "return_params",
      "payout",
      "lifetime",
      "additional_params",
      "google_pay_token"
    ];

    const raw = keysInOrder.map((k) => fields[k] || "").join("");
    return crypto
      .createHmac("sha512", this.publicKey)
      .update(raw)
      .digest("base64");
  }

  private statusMap: Record<number, string> = {
    0: "approved",
    2: "pending",
    3: "declined",
    4: "refunded",
    7: "cancelled"
  };

  public async purchaseTransaction(
    input: PurchaseParams
  ): Promise<PaymentConfig> {
    const { tranId, amount, shipping, items, customer, paymentMethod } = input;
    const req_time = this.makeReqTime();
    const itemsBase64 = Buffer.from(JSON.stringify(items)).toString("base64");

    const returnUrl = process.env.BACKEND_CALLBACK_URL!;
    const cancelUrl = process.env.FRONTEND_RETURN_CANCEL_URL!;
    const successUrl = process.env.FRONTEND_RETURN_SUCCESS_URL!;
    const fields: Record<string, string> = {
      req_time,
      merchant_id: this.merchantId,
      tran_id: tranId,
      amount: amount.toFixed(2),
      currency: "USD",
      items: itemsBase64,
      shipping: shipping.toFixed(2),
      firstname: customer.firstName,
      lastname: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      type: "purchase",
      payment_option: paymentMethod,

      return_url: returnUrl,
      cancel_url: cancelUrl,
      continue_success_url: `${successUrl}?tranId=${tranId}`,

      return_deeplink: "",
      custom_fields: "",
      return_params: "",

      payment_gate: "0",

      payout: "",
      lifetime: "",
      additional_params: "",
      google_pay_token: ""
    };

    fields.hash = this.generateHash(fields);

    return {
      endpoint: `${this.baseUrl}/api/payment-gateway/v1/payments/purchase`,
      payload: fields
    };
  }

  public async handleCallback(body: any): Promise<OrderDoc> {
    const { tran_id: tranId, status } = body;

    const mappedStatus = this.statusMap[+status];
    if (!mappedStatus) throw new AppError("Invalid status", 400);

    const order = await this.orderRepository.updateStatus(tranId, mappedStatus);

    if (!order) throw new AppError("Order not found", 404);
    return order;
  }
}
