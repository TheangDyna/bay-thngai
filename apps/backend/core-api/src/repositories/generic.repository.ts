import { Model, Document } from "mongoose";
import { APIFeatures } from "../utils/apiFeatures";
import { AppError } from "../utils/appError";

export class GenericRepository<T extends Document> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async createOne(data: Partial<T>): Promise<T> {
    const document = await this.model.create(data);
    return document;
  }

  public async getAll(queryString: Record<string, any>): Promise<T[]> {
    const features = new APIFeatures<T>(this.model.find(), queryString)
      .filter() // Supports filtering (e.g., name=computer, price[gte]=100)
      .sort() // Supports sorting (e.g., sort=-name, sort=price)
      .select() // Supports field selection (e.g., select=name,price)
      .paginate(); // Supports pagination (e.g., page=1&limit=10)

    const documents = await features.getQuery();
    return documents;
  }

  public async getOne(id: string): Promise<T> {
    const document = await this.model.findById(id);
    if (!document) {
      throw new AppError("Document not found.", 404);
    }
    return document;
  }

  public async getBy(fieldObj: Record<string, any>): Promise<T> {
    const document = await this.model.findOne(fieldObj);
    if (!document) {
      throw new AppError("Document not found.", 404);
    }
    return document;
  }

  public async updateOne(id: string, data: Partial<T>): Promise<T> {
    const document = await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
    if (!document) {
      throw new AppError("Document not found.", 404);
    }
    return document;
  }

  public async deleteOne(id: string): Promise<void> {
    const document = await this.model.findByIdAndDelete(id);
    if (!document) {
      throw new AppError("Document not found.", 404);
    }
  }
}
