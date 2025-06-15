import { OrderDoc, OrderModel } from "@/src/models/order.model";
import { APIFeatures } from "@/src/utils/apiFeatures";

export default class OrderRepository {
  private searchFields: string[];

  constructor() {
    this.searchFields = ["name", "description"];
  }

  public async create(data: Partial<OrderDoc>): Promise<OrderDoc> {
    const order = await OrderModel.create(data);
    return order;
  }

  public async getAllOrders(
    queryString: Record<string, any>
  ): Promise<{ orders: OrderDoc[]; total: number }> {
    const features = new APIFeatures<OrderDoc>(OrderModel.find(), queryString)
      .filter()
      .search(this.searchFields);

    const total = await OrderModel.countDocuments(
      features.getQuery().getFilter()
    );

    features.sort().select().paginate();

    const orders = await features.getQuery();
    return { total, orders };
  }

  public async findByTranId(tranId: string): Promise<OrderDoc | null> {
    const order = await OrderModel.findOne({ tranId });
    return order;
  }

  public async updatePaymentStatus(
    tranId: string,
    status: string
  ): Promise<OrderDoc | null> {
    let updateOrder = null;
    if (status == "approved") {
      updateOrder = await OrderModel.findOneAndUpdate(
        { tranId },
        { paymentStatus: status, deliveryStatus: "confirmed" },
        { new: true }
      );
    } else {
      updateOrder = await OrderModel.findOneAndUpdate(
        { tranId },
        { paymentStatus: status },
        { new: true }
      );
    }
    return updateOrder;
  }

  public async updateDeliveryStatus(
    tranId: string,
    status: string
  ): Promise<OrderDoc | null> {
    const order = await OrderModel.findByIdAndUpdate(
      tranId,
      { deliveryStatus: status },
      { new: true }
    );
    return order;
  }
}
