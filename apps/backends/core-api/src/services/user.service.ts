// src/services/user.service.ts
import { UserRepository } from "@/src/repositories/user.repository";
import { IProduct } from "@/src/types/product.types";
import { IAddress, IContact, IUserDocument } from "@/src/types/user.types";
import { AppError } from "@/src/utils/appError";
import { Types } from "mongoose";

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

  // ADDRESS
  public async getAllAddresses(userId: string): Promise<IAddress[]> {
    return await this.repository.getAllAddresses(userId);
  }

  public async addAddress(
    userId: string,
    addressData: IAddress
  ): Promise<IAddress> {
    return await this.repository.addAddress(userId, addressData);
  }

  public async updateAddress(
    userId: string,
    addressId: string,
    addressData: Partial<IAddress>
  ): Promise<IAddress> {
    return await this.repository.updateAddress(userId, addressId, addressData);
  }

  public async deleteAddress(userId: string, addressId: string): Promise<void> {
    await this.repository.deleteAddress(userId, addressId);
  }

  public async getAllContacts(userId: string): Promise<IContact[]> {
    return await this.repository.getAllContacts(userId);
  }

  public async addContact(
    userId: string,
    contactData: IContact
  ): Promise<IContact> {
    return await this.repository.addContact(userId, contactData);
  }

  public async updateContact(
    userId: string,
    contactId: string,
    contactData: Partial<IContact>
  ): Promise<IContact> {
    return await this.repository.updateContact(userId, contactId, contactData);
  }

  public async deleteContact(userId: string, contactId: string): Promise<void> {
    await this.repository.deleteContact(userId, contactId);
  }

  public async getWishlist(userId: string): Promise<IProduct[]> {
    const wishlist: IProduct[] = await this.repository.getWishlist(userId);
    return wishlist;
  }

  public async addToWishlist(
    userId: string,
    productId: string
  ): Promise<Types.ObjectId> {
    const user = await this.repository.getUserById(userId);
    if (!user) throw new AppError("User not found.", 404);
    if (!Types.ObjectId.isValid(productId)) {
      throw new AppError("Invalid product ID.", 400);
    }
    if (!user.wishlist.includes(productId as any)) {
      user.wishlist.push(productId as any);
      await user.save();
    }
    return productId as any;
  }

  public async removeFromWishlist(
    userId: string,
    productId: string
  ): Promise<void> {
    const user = await this.repository.getUserById(userId);
    if (!user) throw new AppError("User not found.", 404);
    const index: number = user.wishlist.findIndex(
      (id: Types.ObjectId) => id.toString() === productId
    );
    if (index === -1) throw new AppError("Product not found in wishlist.", 404);
    user.wishlist.splice(index, 1);
    await user.save();
  }
}
