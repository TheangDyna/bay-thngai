import { Document } from "mongoose";
import { GenericRepository } from "../repositories/generic.repository";

export class GenericService<T extends Document> {
  private repository: GenericRepository<T>;

  constructor(repository: GenericRepository<T>) {
    this.repository = repository;
  }

  public async createOne(data: Partial<T>): Promise<T> {
    return await this.repository.createOne(data);
  }

  public async getAll(queryString: Record<string, any>): Promise<T[]> {
    return await this.repository.getAll(queryString);
  }

  public async getOne(id: string): Promise<T> {
    return await this.repository.getOne(id);
  }

  public async updateOne(id: string, data: Partial<T>): Promise<T> {
    return await this.repository.updateOne(id, data);
  }

  public async deleteOne(id: string): Promise<void> {
    return await this.repository.deleteOne(id);
  }
}
