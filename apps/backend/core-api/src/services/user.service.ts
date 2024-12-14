import { User } from "../models/user.model";
import { IUserDocument, UserCreateInput } from "../types/user.types";
import { FactoryRepository } from "../repositories/factory.repository";
import { AppError } from "../utils/appError";

export class UserService {
  public static async createUser(
    data: UserCreateInput
  ): Promise<IUserDocument> {
    return await FactoryRepository.createOne(User, data);
  }

  public static async getUserByCognitoId(cognitoId: string) {
    const user = await User.findOne({ cognitoId });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    return user;
  }
}
