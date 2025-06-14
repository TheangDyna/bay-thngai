import { OrderDoc, OrderModel } from "@/src/models/order.model";

export default class OrderRepository {
  public async create(data: Partial<OrderDoc>): Promise<OrderDoc> {
    const order = await OrderModel.create(data);
    return order;
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

  public async findByTranId(tranId: string): Promise<OrderDoc | null> {
    const order = OrderModel.findOne({ tranId });
    return order;
  }
}
