import { Document } from "mongoose";
import { z } from "zod";
import {
  AddressSchema,
  ContactSchema,
  UserRoleSchema,
  UserSchema
} from "../validators/user.validators";

export type IUser = z.infer<typeof UserSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type IAddress = z.infer<typeof AddressSchema>;
export type IContact = z.infer<typeof ContactSchema>;

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}
