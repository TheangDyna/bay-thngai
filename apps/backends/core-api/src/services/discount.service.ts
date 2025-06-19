import { DiscountRepository } from "@/src/repositories/discount.repository";
import { ProductService } from "@/src/services/product.service";
import { AppError } from "@/src/utils/appError";

export class DiscountService {
  private repository: DiscountRepository;
  private productService: ProductService;

  constructor() {
    this.repository = new DiscountRepository();
    this.productService = new ProductService();
  }

  public async createDiscount(data: any) {
    return await this.repository.create(data);
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
    return updated;
  }

  public async assignToProducts(discountId: string, productIds: string[]) {
    await this.productService.assignDiscountToProducts(discountId, productIds);
  }
}
