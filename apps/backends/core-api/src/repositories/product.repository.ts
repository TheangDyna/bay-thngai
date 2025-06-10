import { Product } from "@/src/models/product.model";
import { IProductDocument } from "@/src/types/product.types";
import { APIFeatures } from "@/src/utils/apiFeatures";
import { AppError } from "@/src/utils/appError";

export class ProductRepository {
  private searchFields: string[];

  constructor() {
    this.searchFields = ["name", "description"];
  }

  public async createProduct(
    data: Partial<IProductDocument>
  ): Promise<IProductDocument> {
    const product = await Product.create(data);
    return product;
  }

  public async getAllProducts(
    queryString: Record<string, any>
  ): Promise<{ products: IProductDocument[]; total: number }> {
    const features = new APIFeatures<IProductDocument>(
      Product.find(),
      queryString
    )
      .filter()
      .search(this.searchFields);

    const total = await Product.countDocuments(features.getQuery().getFilter());

    features.sort().select().paginate();

    const products = await features.getQuery();
    return { total, products };
  }

  public async getProductById(id: string): Promise<IProductDocument> {
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError("Product not found.", 404);
    }
    return product;
  }

  public async getProductByField(
    fieldObj: Record<string, any>
  ): Promise<IProductDocument> {
    const product = await Product.findOne(fieldObj);
    if (!product) {
      throw new AppError("Product not found.", 404);
    }
    return product;
  }

  public async updateProduct(
    id: string,
    data: Partial<IProductDocument>
  ): Promise<IProductDocument> {
    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
    if (!product) {
      throw new AppError("Product not found.", 404);
    }
    return product;
  }

  public async deleteProduct(id: string): Promise<void> {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new AppError("Product not found.", 404);
    }
  }
}
