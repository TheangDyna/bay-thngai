import { Document } from "mongoose";
import { z } from "zod";
import { UserRoleSchema, UserSchema } from "../validators/user.validators";

export type IUser = z.infer<typeof UserSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}
