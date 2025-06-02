import { User } from "@/src/models/user.model";
import { IUserDocument } from "@/src/types/user.types";
import { APIFeatures } from "@/src/utils/apiFeatures";
import { AppError } from "@/src/utils/appError";

export class UserRepository {
  private searchFields: string[];

  constructor() {
    this.searchFields = [];
  }

  public async createUser(
    data: Partial<IUserDocument>
  ): Promise<IUserDocument> {
    const user = await User.create(data);
    return user;
  }

  public async getAllUsers(
    queryString: Record<string, any>
  ): Promise<{ users: IUserDocument[]; total: number }> {
    const features = new APIFeatures<IUserDocument>(User.find(), queryString)
      .filter()
      .search(this.searchFields);

    const total = await User.countDocuments(features.getQuery().getFilter());

    features.sort().select().paginate();

    const users = await features.getQuery();
    return { total, users };
  }

  public async getUserById(id: string): Promise<IUserDocument> {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    return user;
  }

  public async getUserByField(
    fieldObj: Record<string, any>
  ): Promise<IUserDocument> {
    const user = await User.findOne(fieldObj);
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    return user;
  }

  public async updateUser(
    id: string,
    data: Partial<IUserDocument>
  ): Promise<IUserDocument> {
    const user = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    return user;
  }

  public async deleteUser(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new AppError("User not found.", 404);
    }
  }
}
