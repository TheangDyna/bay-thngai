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
  }): Promise<{
    endpoint: string;
    payload: Record<string, string> | FormData;
  }> {
    const req_time = this.makeReqTime();
    const { orderId, amount, items, customer = {} } = input;

    console.log(orderId, amount, items, customer);

    // 1) Build fields
    const fields: Record<string, string> = {
      req_time,
      merchant_id: this.merchantId,
      tran_id: req_time,
      amount: amount.toString(),
      currency: "USD",
      items: Buffer.from(JSON.stringify(items)).toString("base64"),
      shipping: "0",
      firstname: customer.firstname || "",
      lastname: customer.lastname || "",
      email: customer.email || "",
      phone: customer.phone || "",
      type: "",
      return_url: `${process.env.CLIENT_URL}`,
      cancel_url: `${process.env.CLIENT_URL}`,
      continue_success_url: `${process.env.CLIENT_URL}`,
      return_deeplink: "",
      custom_fields: "",
      return_params: "",
      lifetime: "",
      additional_params: "",
      google_pay_token: "",
      payment_gate: "0"
    };

    // 2) Add hash
    fields.hash = this.generateHash(fields);

    // 3) POST as multipart/form-data
    // const form = new FormData();
    // Object.entries(fields).forEach(([k, v]) => form.append(k, v));

    // const resp = await axios.post(
    //   `${this.baseUrl}/api/payment-gateway/v1/payments/purchase`,
    //   form,
    //   {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //       ...form.getHeaders()
    //     }
    //   }
    // );

    // console.log(resp);

    // const html = resp.data as string;

    const endpoint = `${this.baseUrl}/api/payment-gateway/v1/payments/purchase`;

    console.log(fields);
    // console.log(form);

    return { endpoint, payload: fields };
  }
}
