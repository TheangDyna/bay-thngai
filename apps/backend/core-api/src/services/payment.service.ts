// payment.service.ts
// import axios from "axios";
import crypto from "crypto";
import FormData from "form-data";
// import * as cheerio from "cheerio";

export class PaymentService {
  private baseUrl = process.env.ABA_ENDPOINT!;
  private merchantId = process.env.ABA_MERCHANT_ID!;
  private publicKey = process.env.ABA_PUBLIC_KEY!;

  private makeReqTime(): string {
    // YYYYMMDDHHmmss in UTC
    return new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  }

  private generateHash(fields: Record<string, string>): string {
    const keys = [
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
    const raw = keys.map((k) => fields[k] || "").join("");
    return crypto
      .createHmac("sha512", this.publicKey)
      .update(raw)
      .digest("base64");
  }

  public async purchaseTransaction(input: {
    orderId: string;
    amount: number;
    items: Array<{ name: string; qty: number; price: number }>;
    customer?: {
      firstname?: string;
      lastname?: string;
      email?: string;
      phone?: string;
    };
  }): Promise<{ endpoint: string; payload: Record<string, string> }> {
    const req_time = this.makeReqTime();
    const { orderId, amount, items, customer = {} } = input;

    // 1) Build fields
    const fields: Record<string, string> = {
      req_time,
      merchant_id: this.merchantId,
      tran_id: orderId,
      amount: amount.toString(),
      currency: "USD",
      items: Buffer.from(JSON.stringify(items)).toString("base64"),
      shipping: "0",
      firstname: customer.firstname || "",
      lastname: customer.lastname || "",
      email: customer.email || "",
      phone: customer.phone || "",
      type: "purchase",
      payment_option: "",
      return_url: `${process.env.FRONTEND_URL}/payments/callback`,
      cancel_url: `${process.env.FRONTEND_URL}/payments/cancel`,
      continue_success_url: `${process.env.FRONTEND_URL}/payments/success`,
      return_deeplink: "",
      custom_fields: "",
      return_params: "",
      payout: "",
      lifetime: "",
      additional_params: "",
      google_pay_token: ""
    };

    // 2) Add hash
    fields.hash = this.generateHash(fields);

    // 3) POST as multipart/form-data
    const form = new FormData();
    Object.entries(fields).forEach(([k, v]) => form.append(k, v));

    // const resp = await axios.post(
    //   `${this.baseUrl}/api/payment-gateway/v1/payments/purchase`,
    //   form,
    //   { headers: form.getHeaders() }
    // );

    // const html = resp.data as string;

    // 4) Parse with cheerio
    // const $ = cheerio.load(html);
    // const $form = $("form");
    // if (!$form.length) {
    //   throw new Error("No <form> found in PayWay response");
    // }

    const endpoint = `${this.baseUrl}/api/payment-gateway/v1/payments/purchase`;
    // const payload: Record<string, string> = {};
    // $form.find("input").each((_, el) => {
    //   const name = $(el).attr("name");
    //   if (name) {
    //     payload[name] = $(el).attr("value") || "";
    //   }
    // });

    return { endpoint, payload: fields };
  }
}
