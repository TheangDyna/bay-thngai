import { ICartItem } from "@/src/models/cart.models";
import { CartRepository } from "@/src/repositories/cart.repository";

export class CartService {
  constructor(private repo = new CartRepository()) {}

  private async getOrCreateCart(userId: string) {
    let cart = await this.repo.findByUser(userId);
    if (!cart) cart = await this.repo.create(userId);
    return cart;
  }

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    return cart;
  }

  async addItem(userId: string, item: ICartItem) {
    const cart = await this.getOrCreateCart(userId);
    const idx = cart.items.findIndex((i) => i.productId === item.productId);
    if (idx > -1) {
      cart.items[idx].qty += item.qty;
    } else {
      cart.items.push(item);
    }
    return this.repo.save(cart);
  }

  async updateItem(userId: string, item: ICartItem) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = cart.items.map((i) =>
      i.productId === item.productId ? { ...i, qty: item.qty } : i
    );
    return this.repo.save(cart);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = cart.items.filter((i) => i.productId !== productId);
    return this.repo.save(cart);
  }

  async clearCart(userId: string) {
    await this.repo.clear(userId);
  }
}
