import { User } from "../models/user.model";
import { IUserDocument, CreateUserInput } from "../types/user.types";
import { FactoryRepository } from "../repositories/factory.repository";

export class UserService {
  public static async createUser(
    data: CreateUserInput
  ): Promise<IUserDocument> {
    return await FactoryRepository.createOne(User, data);
  }

  public static async getUserByCognitoId(cognitoId: string) {
    return await FactoryRepository.getBy(User, { cognitoId });
  }

  public static async getAllUsers(
    queryString: Record<string, any>
  ): Promise<IUserDocument[]> {
    return await FactoryRepository.getAll(User, queryString);
  }

  public static async getUserById(id: string): Promise<IUserDocument> {
    return await FactoryRepository.getOne(User, id);
  }

  // public static async updateUser(
  //   id: string,
  //   data: any // add type
  // ): Promise<IUserDocument> {
  //   return await FactoryRepository.updateOne(User, id, data);
  // }

  // public static async deleteProduct(id: string): Promise<void> {
  //   return await FactoryRepository.deleteOne(Product, id);
  // }
}
