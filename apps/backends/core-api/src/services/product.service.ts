import { ProductRepository } from "@/src/repositories/product.repository";
import { IProductDocument } from "@/src/types/product.types";

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  public async createProduct(
    data: Partial<IProductDocument>
  ): Promise<IProductDocument> {
    return await this.repository.createProduct(data);
  }

  public async getAllProducts(
    queryString: Record<string, any>
  ): Promise<{ total: number; products: IProductDocument[] }> {
    return await this.repository.getAllProducts(queryString);
  }

  public async getProductById(id: string): Promise<IProductDocument> {
    return await this.repository.getProductById(id);
  }

  public async getProductByField(
    fieldObj: Record<string, any>
  ): Promise<IProductDocument> {
    return await this.repository.getProductByField(fieldObj);
  }

  public async updateProduct(
    id: string,
    data: Partial<IProductDocument>
  ): Promise<IProductDocument> {
    return await this.repository.updateProduct(id, data);
  }

  public async increaseSold(
    productId: string,
    quantity: number
  ): Promise<void> {
    await this.repository.updateProduct(productId, {
      $inc: { sold: quantity }
    });
  }

  public async deleteProduct(id: string): Promise<void> {
    await this.repository.deleteProduct(id);
  }
}
