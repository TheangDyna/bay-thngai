import { User } from "../models/user.model";
import { GenericRepository } from "../repositories/generic.repository";
import { GenericService } from "../services/generic.service";
import { IUserDocument } from "../types/user.types";

export class UserService extends GenericService<IUserDocument> {
  constructor() {
    const userRepository = new GenericRepository(User);
    super(userRepository);
  }
}
