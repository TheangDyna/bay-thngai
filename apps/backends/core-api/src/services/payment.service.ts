// src/services/payment.service.ts
import crypto from "crypto";

export interface PurchaseParams {
  tranId: string;
  amount: number;
  items: Array<{ name: string; qty: number; price: number }>;
  customer: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
}

export class PaymentService {
  // ────── Environment variables (must be set in .env) ──────
  private baseUrl = process.env.ABA_ENDPOINT!; // e.g. "https://checkout-sandbox.payway.com.kh"
  private merchantId = process.env.ABA_MERCHANT_ID!; // e.g. "123456789"
  private publicKey = process.env.ABA_PUBLIC_KEY!; // your HMAC-SHA512 key

  /**
   * Returns a string like "20250605123345" (YYYYMMDDHHmmss in UTC)
   */
  private makeReqTime(): string {
    return new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  }

  /**
   * Compute the HMAC-SHA512 over all fields in the EXACT order PayWay expects.
   * Keys (in order) must match PayWay’s docs:
   *   [
   *     "req_time", "merchant_id", "tran_id", "amount", "items", "shipping",
   *     "firstname", "lastname", "email", "phone", "type", "payment_option",
   *     "return_url", "cancel_url", "continue_success_url", "return_deeplink",
   *     "currency", "custom_fields", "return_params", "payout", "lifetime",
   *     "additional_params", "google_pay_token"
   *   ]
   */
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

    // Join each field in sequence (if missing, use empty string)
    const rawToHash = keys.map((k) => fields[k] || "").join("");
    return crypto
      .createHmac("sha512", this.publicKey)
      .update(rawToHash)
      .digest("base64");
  }

  /**
   * Build every required field (including base64‐encoding items, URLs, etc.),
   * compute `hash`, and return { endpoint, payload }.
   */
  public async purchaseTransaction(input: PurchaseParams): Promise<{
    endpoint: string;
    payload: Record<string, string>;
  }> {
    // ─── 1) Pull out and sanity‐check all inputs ───
    const req_time = this.makeReqTime();
    const { tranId, amount, items, customer } = input;

    // (We already validated existence in the controller, but for safety:)
    if (!tranId) throw new Error("orderId is required");
    if (typeof amount !== "number") throw new Error("amount must be a number");
    if (!Array.isArray(items)) throw new Error("items must be an array");
    if (!customer.firstName || !customer.lastName) {
      throw new Error("customer.firstName and customer.lastName are required");
    }

    // ─── 2) Make sure all environment variables are defined ───
    if (!this.baseUrl) {
      throw new Error("ABA_ENDPOINT (process.env.ABA_ENDPOINT) is not defined");
    }
    if (!this.merchantId) {
      throw new Error("ABA_MERCHANT_ID is not defined");
    }
    if (!this.publicKey) {
      throw new Error("ABA_PUBLIC_KEY is not defined");
    }
    if (!process.env.BACKEND_CALLBACK_URL) {
      throw new Error("BACKEND_CALLBACK_URL is not defined");
    }
    if (!process.env.FRONTEND_RETURN_SUCCESS_URL) {
      throw new Error("FRONTEND_RETURN_SUCCESS_URL is not defined");
    }
    if (!process.env.FRONTEND_RETURN_CANCEL_URL) {
      throw new Error("FRONTEND_RETURN_CANCEL_URL is not defined");
    }

    // ─── 3) Base64‐encode JSON fields exactly as PayWay wants ───
    // - “items” must be base64(JSON.stringify(items))
    const itemsArray = items; // guaranteed to be an array by above checks
    const itemsBase64 = Buffer.from(JSON.stringify(itemsArray)).toString(
      "base64"
    );

    // - “return_url”, “cancel_url”, “continue_success_url” must each be base64(<your‐URL‐string>)
    const return_url = process.env.BACKEND_CALLBACK_URL!;
    const cancel_url = process.env.FRONTEND_RETURN_CANCEL_URL!;
    const continue_success_url = process.env.FRONTEND_RETURN_SUCCESS_URL!;

    // ─── 4) Build the fields object (all strings) ───
    const fields: Record<string, string> = {
      req_time,
      merchant_id: this.merchantId,
      // Use `orderId` as your tran_id (it must be unique per purchase)
      tran_id: tranId,
      // amount as a string (PayWay expects no decimal if working in KHR; if USD, format “100.00”)
      amount: amount.toString(),
      // currency code must match your merchant account (e.g. "USD" or "KHR")
      currency: "USD",

      // Base64‐encoded items
      items: itemsBase64,

      // If you don’t charge shipping or don’t use “goods description type,” leave empty
      shipping: "0",

      // Customer’s first & last name
      firstname: customer.firstName,
      lastname: customer.lastName,

      // Optional contact info
      email: customer.email || "",
      phone: customer.phone || "",

      // “purchase” for a normal sale
      type: "purchase",

      // If you want to force the ABA PayWay widget to default to “abapay,” set it;
      // otherwise leave blank (PayWay’s hosted checkout will show all supported methods).
      payment_option: "",

      // base64‐encoded return URLs
      return_url,
      cancel_url,
      continue_success_url,

      // We’re not using a mobile deep link here—leave blank if you don’t need it
      return_deeplink: "",

      // Optional: if you need any custom key–value pairs, you can send them here
      custom_fields: "",
      return_params: "",

      // “payout,” “lifetime,” “additional_params,” and “google_pay_token” are optional →
      // leave blank unless you specifically need them.
      payout: "",
      lifetime: "",
      additional_params: "",
      google_pay_token: "",

      // The “payment_gate” field is specific to some merchants. If you don’t need to force a
      // particular 3rd-party gateway, use "0" or leave empty. Here we set "0" (all gates).
      payment_gate: "0",

      view_type: "hosted_view"
    };

    // ─── 5) Compute HMAC-SHA512 hash over EXACT sequence PayWay requires ───
    fields.hash = this.generateHash(fields);

    // ─── 6) Return `{ endpoint, payload }` (the frontend will build the form) ───
    const endpoint = `${this.baseUrl}/api/payment-gateway/v1/payments/purchase`;

    return { endpoint, payload: fields };
  }
}
