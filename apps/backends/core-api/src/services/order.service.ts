// src/services/order.service.ts
import {
  DeliveryStatus,
  Item,
  OrderDoc,
  PaymentStatus
} from "@/src/models/order.model";
import OrderRepository from "@/src/repositories/order.repository";
import PaymentService, {
  PaymentConfig,
  PurchaseParams
} from "@/src/services/payment.service";
import { ProductService } from "@/src/services/product.service";
import { emitOrderUpdate } from "@/src/socket";
import { AppError } from "@/src/utils/appError";
import { CreateOrderInput } from "@/src/validators/order.validators";
import { Types } from "mongoose";
import { customAlphabet } from "nanoid";

export default class OrderService {
  private orderRepository = new OrderRepository();
  private paymentService = new PaymentService();
  private productService = new ProductService();

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
    const amount = itemsTotal + input.shipping + input.tip;

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
      tip: input.tip,
      paymentMethod: input.paymentMethod,
      deliveryAddress: input.deliveryAddress,
      deliveryTimeSlot: input.deliveryTimeSlot,
      instructions: input.instructions,
      amount,
      paymentStatus: "pending" as PaymentStatus,
      deliveryStatus: "pending" as DeliveryStatus,
      leaveAtDoor: input.leaveAtDoor
    });

    if (input.paymentMethod === "cod") {
      for (const item of order.items) {
        await this.productService.increaseSold(
          item.productId.toString(),
          item.quantity
        );
      }

      const updatedOrder =
        await this.orderRepository.updatePaymentStatusCod(tranId);
      if (!updatedOrder) {
        throw new AppError("Order not found", 404);
      }

      return { order: updatedOrder };
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
      customer: {
        firstName: input.customer.firstName ?? "",
        lastName: input.customer.lastName ?? "",
        email: input.customer.email ?? "",
        phone: input.customer.phone
      },
      paymentMethod: input.paymentMethod
    };

    const paymentConfig =
      await this.paymentService.purchaseTransaction(purchaseParams);

    for (const item of order.items) {
      await this.productService.increaseSold(
        item.productId.toString(),
        item.quantity
      );
    }

    return { order, paymentConfig };
  }

  public async getAllOrders(
    queryString: Record<string, any>
  ): Promise<{ total: number; orders: OrderDoc[] }> {
    return await this.orderRepository.getAllOrders(queryString);
  }

  public async getUserOrders(
    queryString: Record<string, any>
  ): Promise<{ total: number; orders: OrderDoc[] }> {
    const { email, ...query } = queryString;
    return await this.orderRepository.getAllOrders({
      ...query,
      "customer.email": email
    });
  }

  public async getOrderByTranId(tranId: string) {
    const order = await this.orderRepository.findByTranId(tranId);
    if (!order) throw new Error("Order not found");
    return order;
  }

  private allowedStatuses: OrderDoc["deliveryStatus"][] = [
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled"
  ];

  public async updateDeliveryStatus(
    orderId: string,
    status: string
  ): Promise<OrderDoc> {
    if (!this.allowedStatuses.includes(status as OrderDoc["deliveryStatus"])) {
      throw new AppError("Invalid delivery status", 400);
    }

    const updated = await this.orderRepository.updateDeliveryStatus(
      orderId,
      status
    );
    if (!updated) throw new AppError("Order not found", 404);

    if (updated) {
      emitOrderUpdate(updated.tranId, updated);
    }

    return updated;
  }
}
