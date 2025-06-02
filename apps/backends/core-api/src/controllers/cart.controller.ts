// src/controllers/cart.controller.ts
import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

export class CartController {
  constructor(private service = new CartService()) {}

  async getCart(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const cart = await this.service.getCart(userId);
    res.json({ status: "success", data: cart });
  }

  async addToCart(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const { productId, qty } = req.body;
    const cart = await this.service.addItem(userId, { productId, qty });
    res.status(201).json({ status: "success", data: cart });
  }

  async updateCartItem(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const { productId, qty } = req.body;
    const cart = await this.service.updateItem(userId, { productId, qty });
    res.json({ status: "success", data: cart });
  }

  async removeCartItem(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const { productId } = req.params;
    const cart = await this.service.removeItem(userId, productId);
    res.json({ status: "success", data: cart });
  }

  async clearCart(req: Request, res: Response) {
    const userId = (req as any).user.id;
    await this.service.clearCart(userId);
    res.status(204).end();
  }
}
