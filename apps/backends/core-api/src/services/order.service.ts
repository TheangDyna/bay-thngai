// src/services/order.service.ts
import { Item, OrderDoc } from "@/src/models/order.model";
import OrderRepository from "@/src/repositories/order.repository";
import PaymentService, {
  PaymentConfig,
  PurchaseParams
} from "@/src/services/payment.service";
import { AppError } from "@/src/utils/appError";
import { CreateOrderInput } from "@/src/validators/order.validators";
import { Types } from "mongoose";
import { customAlphabet } from "nanoid";

export default class OrderService {
  private orderRepository = new OrderRepository();
  private paymentService = new PaymentService();

  public async create(
    input: CreateOrderInput
  ): Promise<{ order: OrderDoc; paymentConfig?: PaymentConfig }> {
    const alphabet =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const generateId = customAlphabet(alphabet, 20);
    const tranId = generateId();
    const itemsTotal = input.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const amount = itemsTotal + input.shipping + (input.tip || 0);

    // convert string IDs to mongoose.Types.ObjectId
    const dbItems: Item[] = input.items.map((i) => ({
      productId: new Types.ObjectId(i.productId),
      quantity: i.quantity,
      price: i.price
    }));

    const order = await this.orderRepository.create({
      tranId,
      items: dbItems,
      customer: input.customer,
      shipping: input.shipping,
      tip: input.tip || 0,
      paymentMethod: input.paymentMethod,
      deliveryAddressId: input.deliveryAddressId,
      deliveryTimeSlot: input.deliveryTimeSlot,
      instructions: input.instructions,
      amount,
      status: "pending"
    });

    if (input.paymentMethod === "cod") {
      return { order };
    }

    const purchaseParams: PurchaseParams = {
      tranId,
      amount,
      shipping: input.shipping,
      items: input.items.map((i) => ({
        name: i.productId,
        quantity: i.quantity,
        price: i.price
      })),
      customer: input.customer
    };
    const paymentConfig =
      await this.paymentService.purchaseTransaction(purchaseParams);

    return { order, paymentConfig };
  }

  public async handleCallback(body: any): Promise<OrderDoc> {
    const { tran_id: tranId, status } = body;

    const statusMap: Record<string | number, string> = {
      0: "approved",
      2: "pending",
      3: "declined",
      4: "refunded",
      7: "cancelled"
    };

    const mappedStatus = statusMap[status];

    const order = await this.orderRepository.updateStatus(tranId, mappedStatus);

    if (!order) throw new AppError("Order not found", 404);
    return order;
  }
}
