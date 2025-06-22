import { DiscountRepository } from "@/repositories/discount.repository";
import { ProductService } from "@/services/product.service";
import { PushSubscriptionService } from "@/services/pushSubscription.service";
import { AppError } from "@/utils/appError";
import webpush from "web-push";

export class DiscountService {
  private repository: DiscountRepository;
  private productService: ProductService;

  constructor() {
    this.repository = new DiscountRepository();
    this.productService = new ProductService();
  }

  public async createDiscount(data: any) {
    const discount = await this.repository.create(data);
    if (discount.active) {
      await this.notifyDiscountChange(discount);
    }
    return discount;
  }

  public async getAllDiscounts(queryString: Record<string, any>) {
    return await this.repository.findAll(queryString);
  }

  public async getDiscountById(id: string) {
    const discount = await this.repository.findById(id);
    if (!discount) throw new AppError("Discount not found", 404);
    return discount;
  }

  public async updateDiscountById(id: string, data: any) {
    const updated = await this.repository.updateById(id, data);
    if (!updated) throw new AppError("Failed to update discount", 404);
    if (updated.active && data.active !== false) {
      await this.notifyDiscountChange(updated);
    }
    return updated;
  }

  public async assignToProducts(discountId: string, productIds: string[]) {
    await this.productService.assignDiscountToProducts(discountId, productIds);
  }

  public async removeDiscountFromProducts(productIds: string[]) {
    return await this.productService.assignDiscountToProducts(null, productIds);
  }

  private async notifyDiscountChange(discount: any): Promise<void> {
    const pushService = new PushSubscriptionService();
    const subscriptions = await pushService.listAllSubscriptions();
    const title = `🎉 New Discount Alert!`;
    const message = `Save ${discount.type === "percentage" ? `${discount.amount}%` : `$${discount.amount}`} on ${discount.name}! Ends ${discount.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}.`;
    const payload = JSON.stringify({
      title,
      message,
      data: {
        url: `/search` // Direct to discount page
      }
    });

    const sendPromises = subscriptions.map((sub) =>
      webpush.sendNotification(sub as any, payload).catch(async (err) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await pushService.removeSubscription((sub as any).endpoint);
        } else {
          console.error("Push send error:", err);
        }
      })
    );

    await Promise.all(sendPromises);
  }
}
