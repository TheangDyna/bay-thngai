import { Document } from "mongoose";
import { z } from "zod";
import { UserSchema } from "../validators/user.validators";

export type IUser = z.infer<typeof UserSchema>;

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}
