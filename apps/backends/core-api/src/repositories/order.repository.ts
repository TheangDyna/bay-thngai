// src/repositories/order.repository.ts
import { IOrder, OrderModel } from "@/src/models/order.model";

export class OrderRepository {
  async create(orderData: Partial<IOrder>): Promise<IOrder> {
    const order = new OrderModel(orderData);
    return order.save();
  }

  async findByTranId(tranId: string): Promise<IOrder | null> {
    return OrderModel.findOne({ tranId }).exec();
  }

  async updateStatus(tranId: string, status: string): Promise<IOrder | null> {
    return OrderModel.findOneAndUpdate(
      { tranId },
      { status },
      { new: true }
    ).exec();
  }

  async findById(id: string): Promise<IOrder | null> {
    return OrderModel.findById(id).exec();
  }

  async listAll(): Promise<IOrder[]> {
    return OrderModel.find().sort({ createdAt: -1 }).exec();
  }
}
