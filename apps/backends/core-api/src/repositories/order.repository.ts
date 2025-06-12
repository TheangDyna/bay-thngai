import { OrderDoc, OrderModel } from "@/src/models/order.model";

export default class OrderRepository {
  public async create(data: Partial<OrderDoc>): Promise<OrderDoc> {
    const o = new OrderModel(data);
    return o.save();
  }

  public async updateStatus(
    tranId: string,
    status: string
  ): Promise<OrderDoc | null> {
    const updateOrder = OrderModel.findOneAndUpdate(
      { tranId },
      { status },
      { new: true }
    );
    return updateOrder;
  }
}
