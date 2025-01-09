import { Model, Document } from "mongoose";
import { APIFeatures } from "../utils/apiFeatures";
import { AppError } from "../utils/appError";

export class GenericRepository<T extends Document> {
  private model: Model<T>;
  private searchFields: string[];

  constructor(model: Model<T>, searchFields: string[] = []) {
    this.model = model;
    this.searchFields = searchFields;
  }

  public async createOne(data: Partial<T>): Promise<T> {
    const document = await this.model.create(data);
    return document;
  }

  public async getAll(
    queryString: Record<string, any>
  ): Promise<{ documents: T[]; total: number }> {
    const features = new APIFeatures<T>(this.model.find(), queryString)
      .filter() // e.g., name=Chicken, price[gte]=5
      .search(this.searchFields); // e.g., search=Chicken

    const total = await this.model.countDocuments(
      features.getQuery().getFilter()
    );

    features
      .sort() // e.g., sort=-name, sort=price
      .select() // e.g., select=name,price
      .paginate(); // e.g., page=1&limit=10

    // return await features.execute();

    const documents = await features.getQuery();
    return { total, documents };
    // const features = new APIFeatures<T>(this.model, queryString)

    //   .filter() // Supports filtering (e.g., name=computer, price[gte]=100)
    //   .search(this.searchFields) // Supports filtering (e.g., search=laptop)
    //   .sort() // Supports sorting (e.g., sort=-name, sort=price)
    //   .select() // Supports field selection (e.g., select=name,price)
    //   .paginate(); // Supports pagination (e.g., page=1&limit=10)

    // return await features.execute();
  }

  public async getOne(id: string): Promise<T> {
    const document = await this.model.findById(id);
    if (!document) {
      throw new AppError(`${this.model.modelName} not found.`, 404);
    }
    return document;
  }

  public async getBy(fieldObj: Record<string, any>): Promise<T> {
    const document = await this.model.findOne(fieldObj);
    if (!document) {
      throw new AppError(`${this.model.modelName} not found.`, 404);
    }
    return document;
  }

  public async updateOne(id: string, data: Partial<T>): Promise<T> {
    const document = await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
    if (!document) {
      throw new AppError(`${this.model.modelName} not found.`, 404);
    }
    return document;
  }

  public async deleteOne(id: string): Promise<void> {
    const document = await this.model.findByIdAndDelete(id);
    if (!document) {
      throw new AppError(`${this.model.modelName} not found.`, 404);
    }
  }
}
