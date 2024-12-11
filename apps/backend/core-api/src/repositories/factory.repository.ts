import { Model, Document } from "mongoose";
import { AppError } from "../types/error.types";
import { APIFeatures } from "../utils/apiFeatures";

export class FactoryRepository {
  static async getAll<T extends Document>(
    Model: Model<T>,
    queryString: Record<string, any>
  ): Promise<T[]> {
    const features = new APIFeatures<T>(Model.find(), queryString)
      .filter() // name=computer, price[gte]=100, price[lt]=100
      .sort() // sort=-name, sort=price
      .select() // select=name, select=name,price
      .paginate(); // page=1&limit=10

    return await features.getQuery();
  }

  static async getOne<T extends Document>(
    Model: Model<T>,
    id: string
  ): Promise<T> {
    const doc = await Model.findById(id);
    if (!doc) {
      throw new AppError("Document not found", 404);
    }
    return doc;
  }

  static async createOne<T extends Document>(
    Model: Model<T>,
    data: any
  ): Promise<T> {
    return await Model.create(data);
  }

  static async updateOne<T extends Document>(
    Model: Model<T>,
    id: string,
    data: any
  ): Promise<T> {
    const doc = await Model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      throw new AppError("Document not found", 404);
    }
    return doc;
  }

  static async deleteOne<T extends Document>(
    Model: Model<T>,
    id: string
  ): Promise<void> {
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      throw new AppError("Document not found", 404);
    }
  }
}
