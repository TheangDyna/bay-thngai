// src/repositories/user.repository.ts
import { User } from "@/src/models/user.model";
import { IAddress, IUserDocument } from "@/src/types/user.types";
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

  // ─────────────────────────────────────────────────────────────────────────────
  // Address-related methods:
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Fetch the addresses array for a specific user.
   */
  public async getAllAddresses(userId: string): Promise<IAddress[]> {
    const user = await User.findById(userId).select("addresses");
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    return user.addresses;
  }

  /**
   * Add a new address subdocument to a user.
   */
  public async addAddress(
    userId: string,
    addressData: IAddress
  ): Promise<IAddress> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    // Push into addresses array
    user.addresses.push(addressData);
    await user.save();
    // Return the newly added address (last element)
    return user.addresses[user.addresses.length - 1];
  }

  /**
   * Update an existing address subdocument by its _id.
   */
  public async updateAddress(
    userId: string,
    addressId: string,
    addressData: Partial<IAddress>
  ): Promise<IAddress> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    const address = user.addresses.find(
      (addr: any) => addr._id?.toString() === addressId
    );
    if (!address) {
      throw new AppError("Address not found.", 404);
    }
    // Update fields
    Object.assign(address, addressData);
    await user.save();
    return address;
  }

  /**
   * Delete an address subdocument by its _id.
   */
  public async deleteAddress(userId: string, addressId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    const addressIndex = user.addresses.findIndex(
      (addr: any) => addr._id?.toString() === addressId
    );
    if (addressIndex === -1) {
      throw new AppError("Address not found.", 404);
    }
    user.addresses.splice(addressIndex, 1);
    await user.save();
  }
}
