import { Cart, ICart } from "@/src/models/cart.models";

export class CartRepository {
  async findByUser(userId: string): Promise<ICart | null> {
    return Cart.findOne({ userId });
  }

  async create(userId: string): Promise<ICart> {
    return Cart.create({ userId, items: [] });
  }

  async save(cart: ICart): Promise<ICart> {
    return cart.save();
  }

  async clear(userId: string): Promise<void> {
    await Cart.updateOne({ userId }, { items: [] });
  }
}
