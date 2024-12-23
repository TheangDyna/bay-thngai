import { User } from "../models/user.model";
import { GenericRepository } from "../repositories/generic.repository";
import { IUserDocument } from "../types/user.types";

export class UserService {
  private genericRepository = new GenericRepository<IUserDocument>(User);

  public async createUser(
    data: Partial<IUserDocument>
  ): Promise<IUserDocument> {
    return await this.genericRepository.createOne(data);
  }

  public async getUserByCognitoId(cognitoId: string): Promise<IUserDocument> {
    return await this.genericRepository.getBy({ cognitoId });
  }
}
