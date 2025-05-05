import { Types } from "mongoose";
import { GenericRepository } from "../repositories/generic.repository";
import { GenericService } from "./generic.service";
import { ICartDocument, ICartItem } from "../types/cart.types";
import { AppError } from "../utils/appError";
import { Cart } from "@/src/models/cart.model";

export class CartService extends GenericService<ICartDocument> {
  private cartRepository: GenericRepository<ICartDocument>;

  constructor() {
    const cartRepository = new GenericRepository(Cart);
    super(cartRepository);
    this.cartRepository = cartRepository;
  }

  // get or create user's cart
  public async getCartByUser(userId: string): Promise<ICartDocument> {
    let cart = await this.cartRepository.getBy({ user: userId });
    if (!cart) {
      cart = await this.cartRepository.createOne({
        user: new Types.ObjectId(userId)
      });
    }
    return cart;
  }

  // add or increment
  public async addToCart(
    userId: string,
    productId: string,
    quantity = 1
  ): Promise<ICartItem[]> {
    const cart = await this.getCartByUser(userId);

    const existing = cart.items.find((i) =>
      (i.product as Types.ObjectId).equals(productId)
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        product: new Types.ObjectId(productId),
        quantity
      });
    }

    await cart.save();
    return cart.items;
  }

  // remove an item completely
  public async removeFromCart(
    userId: string,
    productId: string
  ): Promise<ICartItem[]> {
    const cart = await this.getCartByUser(userId);
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(
      (i) => !(i.product as Types.ObjectId).equals(productId)
    );

    if (cart.items.length === originalLength) {
      throw new AppError("Item not found in cart", 404);
    }

    await cart.save();
    return cart.items;
  }

  public async clearCart(userId: string): Promise<void> {
    const cart = await this.getCartByUser(userId);
    cart.items = [];
    await cart.save();
  }
}
