import { Order, IOrder } from "../models/order.model";

export class OrderRepository {
  async create(data: Partial<IOrder>) {
    return Order.create(data);
  }
  async findById(id: string) {
    return Order.findById(id);
  }
}
