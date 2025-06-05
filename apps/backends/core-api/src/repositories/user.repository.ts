import { User } from "@/src/models/user.model";
import { IAddress, IContact, IUserDocument } from "@/src/types/user.types";
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

  // ADDRESS
  public async getAllAddresses(userId: string): Promise<IAddress[]> {
    const user = await User.findById(userId).select("addresses");
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    return user.addresses;
  }

  public async addAddress(
    userId: string,
    addressData: IAddress
  ): Promise<IAddress> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    user.addresses.push(addressData);
    await user.save();
    return user.addresses[user.addresses.length - 1];
  }

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
    Object.assign(address, addressData);
    await user.save();
    return address;
  }

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

  // CONTACT
  public async getAllContacts(userId: string): Promise<IContact[]> {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found.", 404);
    return user.contacts;
  }

  public async addContact(
    userId: string,
    contactData: IContact
  ): Promise<IContact> {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found.", 404);

    user.contacts.push(contactData);
    await user.save();
    return user.contacts[user.contacts.length - 1];
  }

  public async updateContact(
    userId: string,
    contactId: string,
    contactData: Partial<IContact>
  ): Promise<IContact> {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found.", 404);

    const idx = user.contacts.findIndex(
      (c: any) => c._id?.toString() === contactId
    );
    if (idx === -1) throw new AppError("Contact not found.", 404);

    Object.assign(user.contacts[idx], contactData);
    await user.save();
    return user.contacts[idx];
  }

  public async deleteContact(userId: string, contactId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found.", 404);

    const idx = user.contacts.findIndex(
      (c: any) => c._id?.toString() === contactId
    );
    if (idx === -1) throw new AppError("Contact not found.", 404);

    user.contacts.splice(idx, 1);
    await user.save();
  }
}
