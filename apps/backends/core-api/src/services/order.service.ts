// src/services/order.service.ts

import { IOrder } from "@/src/models/order.model";
import { OrderRepository } from "@/src/repositories/order.repository";
import { PaymentService, PurchaseParams } from "@/src/services/payment.service";
import { generateTranId } from "@/src/utils/generateTranId";

export interface CreateOrderInput {
  items: Array<{ productId: string; quantity: number; price: number }>;
  customer: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  shipping?: number; // optional, default to 0
}

export class OrderService {
  private orderRepo = new OrderRepository();
  private paymentService = new PaymentService();

  /**
   * 1) Generate a unique tranId
   * 2) Compute amount = sum(items) + shipping
   * 3) Save order with status “PENDING”
   * 4) Call PaymentService.purchaseTransaction(...)
   * 5) Return { order, paymentConfig }
   */
  public async create(input: CreateOrderInput): Promise<{
    order: IOrder;
    paymentConfig: { endpoint: string; payload: Record<string, string> };
  }> {
    const { items, customer } = input;
    const shipping = input.shipping || 0;

    // 1) Generate a 20-char unique tranId
    const tranId = generateTranId();

    // 2) Compute itemsTotal & total amount
    const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const amount = itemsTotal + shipping;

    // 3) Create the order in the DB with status “PENDING”
    const orderData = {
      tranId,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price
      })),
      customer,
      amount,
      shipping,
      status: "PENDING" as const
    };
    const order = await this.orderRepo.create(orderData);

    // 4) Build payment payload
    const purchaseParams: PurchaseParams = {
      tranId,
      amount,
      shipping,
      items: items.map((i) => ({
        name: i.productId,
        quantity: i.quantity,
        price: i.price
      })),
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      }
    };

    const paymentConfig =
      await this.paymentService.purchaseTransaction(purchaseParams);

    return { order, paymentConfig };
  }

  public async getById(orderId: string): Promise<IOrder | null> {
    return this.orderRepo.findById(orderId);
  }

  public async listAll(): Promise<IOrder[]> {
    return this.orderRepo.listAll();
  }
}
