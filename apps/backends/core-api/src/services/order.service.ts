import { OrderRepository } from "@/src/repositories/order.repository";

export class OrderService {
  constructor(private repo = new OrderRepository()) {}

  async placeOrder(userId: string, dto: any) {
    // 1. (opt) verify stock, calc totals...
    // 2. (opt) process payment via Stripe/ABA SDK
    const status = dto.paymentMethod === "cod" ? "pending" : "paid";
    const order = await this.repo.create({ ...dto, userId, status });
    return order;
  }
}
