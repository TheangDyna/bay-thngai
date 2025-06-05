// src/services/payment.service.ts
import axios from "axios";
import crypto from "crypto";

export interface PurchaseParams {
  tranId: string;
  amount: number;
  shipping: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  customer: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
}

export class PaymentService {
  private baseUrl = process.env.ABA_ENDPOINT!;
  private merchantId = process.env.ABA_MERCHANT_ID!;
  private publicKey = process.env.ABA_PUBLIC_KEY!;

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

  public async purchaseTransaction(input: PurchaseParams): Promise<{
    endpoint: string;
    payload: Record<string, string>;
  }> {
    const req_time = this.makeReqTime();
    const { tranId, amount, shipping, items, customer } = input;

    if (!tranId || tranId.length > 20) {
      throw new Error("tranId is required and must be ≤ 20 characters.");
    }
    if (typeof amount !== "number" || typeof shipping !== "number") {
      throw new Error("amount and shipping must be numbers (smallest unit).");
    }

    const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    if (itemsTotal + shipping !== amount) {
      throw new Error(
        `Amount mismatch: itemsTotal (${itemsTotal}) + shipping (${shipping}) must equal amount (${amount}).`
      );
    }

    const itemsBase64 = Buffer.from(JSON.stringify(items)).toString("base64");

    const rawReturnUrl = process.env.BACKEND_CALLBACK_URL!;
    const rawCancelUrl = process.env.FRONTEND_RETURN_CANCEL_URL!;
    const rawSuccessUrl = process.env.FRONTEND_RETURN_SUCCESS_URL!;

    if (!rawReturnUrl || !rawCancelUrl || !rawSuccessUrl) {
      throw new Error(
        "Missing BACKEND_CALLBACK_URL, FRONTEND_RETURN_CANCEL_URL, or FRONTEND_RETURN_SUCCESS_URL in environment."
      );
    }

    const return_url = rawReturnUrl;
    const cancel_url = rawCancelUrl;
    const continue_success_url = rawSuccessUrl;

    const fields: Record<string, string> = {
      req_time,
      merchant_id: this.merchantId,
      tran_id: tranId,
      amount: amount.toString(),
      currency: "USD",

      items: itemsBase64,
      shipping: shipping.toString(),

      firstname: customer.firstName,
      lastname: customer.lastName,
      email: customer.email || "",
      phone: customer.phone || "",

      type: "purchase",

      payment_option: "",

      return_url,
      cancel_url,
      continue_success_url,

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

    const endpoint = `${this.baseUrl}/api/payment-gateway/v1/payments/purchase`;

    return { endpoint, payload: fields };
  }

  public async checkTransaction(tranId: string): Promise<string> {
    const req_time = this.makeReqTime();
    const merchant_id = this.merchantId;

    const hash = crypto
      .createHmac("sha512", this.publicKey)
      .update(`${req_time}${merchant_id}${tranId}`)
      .digest("base64");

    const endpoint = `${this.baseUrl}/api/payment-gateway/v1/payments/check-transaction`;

    try {
      const { data } = await axios.post<{ payment_status: string }>(
        endpoint,
        { req_time, merchant_id, tran_id: tranId, hash },
        { headers: { "Content-Type": "application/json" } }
      );
      return data.payment_status;
    } catch (error: any) {
      throw new Error(
        `Failed to check transaction: ${error.response?.data?.message || error.message}`
      );
    }
  }
}
