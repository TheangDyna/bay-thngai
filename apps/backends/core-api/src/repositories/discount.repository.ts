import { Discount } from "@/src/models/discount.model";
import { Product } from "@/src/models/product.model";
import { APIFeatures } from "@/src/utils/apiFeatures";

export class DiscountRepository {
  private searchFields: string[];

  constructor() {
    this.searchFields = ["name", "description"];
  }

  public async create(data: any) {
    return await Discount.create(data);
  }

  public async findAll(queryString: Record<string, any>) {
    const features = new APIFeatures(Discount.find(), queryString)
      .filter()
      .search(this.searchFields);

    const total = await Discount.countDocuments(
      features.getQuery().getFilter()
    );

    features.sort().select().paginate();

    const discounts = await features.getQuery();
    return { total, discounts };
  }

  public async findById(id: string) {
    return await Discount.findById(id);
  }

  public async updateById(id: string, data: any) {
    return await Discount.findByIdAndUpdate(id, data, { new: true });
  }

  public async assignToProducts(discountId: string, productIds: string[]) {
    return await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { discountRef: discountId } }
    );
  }
}
