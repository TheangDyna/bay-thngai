// src/controllers/order.controller.ts
import { CreateOrderInput, OrderService } from "@/src/services/order.service";
import { Request, Response } from "express";

export class OrderController {
  private service = new OrderService();

  /**
   * POST /api/orders
   * body: {
   *   items: [{ productId, quantity, price }, …],
   *   customer: { firstName, lastName, email?, phone? },
   *   shipping?: number
   * }
   */
  public createOrder = async (req: Request, res: Response) => {
    try {
      const { items, customer, shipping } = req.body as CreateOrderInput;

      // Basic validation (you can add more robust checks)
      if (
        !Array.isArray(items) ||
        items.length === 0 ||
        !customer?.firstName ||
        !customer?.lastName
      ) {
        return res.status(400).json({
          error:
            "Invalid order data. Required: items: non-empty array, customer.firstName, customer.lastName."
        });
      }

      const { order, paymentConfig } = await this.service.create({
        items,
        customer,
        shipping
      });

      // Return both the saved order (with its _id, tranId, status="PENDING", etc.)
      // and the paymentConfig (endpoint + payload) so frontend can redirect to PayWay.
      return res.status(201).json({ order, paymentConfig });
    } catch (err: any) {
      console.error("OrderController.createOrder error:", err);
      return res.status(500).json({ error: "Failed to create order." });
    }
  };

  /**
   * GET /api/orders/:id
   * Return the order by its Mongo ID
   */
  public getOrderById = async (req: Request, res: Response) => {
    try {
      const orderId = req.params.id;
      const order = await this.service.getById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found." });
      }
      return res.json(order);
    } catch (err: any) {
      console.error("OrderController.getOrderById error:", err);
      return res.status(500).json({ error: "Server error." });
    }
  };

  /**
   * GET /api/orders
   * List all orders
   */
  public listOrders = async (_req: Request, res: Response) => {
    try {
      const orders = await this.service.listAll();
      return res.json(orders);
    } catch (err: any) {
      console.error("OrderController.listOrders error:", err);
      return res.status(500).json({ error: "Server error." });
    }
  };
}
