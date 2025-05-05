import { GenericRepository } from "../repositories/generic.repository";
import { GenericService } from "./generic.service";
import { Order, IOrderDocument } from "@/src/models/order.model";
import { Cart, ICartDocument } from "@/src/models/cart.model";
import { AppError } from "../utils/appError";

export class OrderService extends GenericService<IOrderDocument> {
  private orderRepo: GenericRepository<IOrderDocument>;
  private cartRepo: GenericRepository<ICartDocument>;

  constructor() {
    const orderRepository = new GenericRepository(Order);
    super(orderRepository);
    this.orderRepo = orderRepository;
    this.cartRepo = new GenericRepository(Cart);
  }

  /**
   * Creates an Order from a given Cart, assigns to user, then clears the cart.
   */
  async createOrderFromCart(
    userId: string,
    cartId: string
  ): Promise<IOrderDocument> {
    // 1) fetch & validate cart
    const cart = await this.cartRepo.getBy({ _id: cartId, user: userId });
    if (!cart) throw new AppError("Cart not found", 404);

    // 2) build items array (assumes cart.items is populated with product docs)
    const items = cart.items.map((i) => ({
      product: i.product._id || i.product,
      quantity: i.quantity,
      price: (i.product as any).price
    }));

    // 3) calculate total
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // 4) create order
    const order = await this.orderRepo.createOne({
      user: userId,
      items,
      total,
      paymentStatus: "pending"
    });

    // 5) clear cart
    cart.items = [];
    await cart.save();

    return order;
  }
}
