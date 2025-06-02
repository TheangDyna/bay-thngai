import { UserRepository } from "@/src/repositories/user.repository";
import { IUserDocument } from "@/src/types/user.types";

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  public async createUser(
    data: Partial<IUserDocument>
  ): Promise<IUserDocument> {
    return await this.repository.createUser(data);
  }

  public async getAllUsers(
    queryString: Record<string, any>
  ): Promise<{ total: number; users: IUserDocument[] }> {
    return await this.repository.getAllUsers(queryString);
  }

  public async getUserById(id: string): Promise<IUserDocument> {
    return await this.repository.getUserById(id);
  }

  public async getUserByField(
    fieldObj: Record<string, any>
  ): Promise<IUserDocument> {
    return await this.repository.getUserByField(fieldObj);
  }

  public async updateUser(
    id: string,
    data: Partial<IUserDocument>
  ): Promise<IUserDocument> {
    return await this.repository.updateUser(id, data);
  }

  public async deleteUser(id: string): Promise<void> {
    await this.repository.deleteUser(id);
  }
}
