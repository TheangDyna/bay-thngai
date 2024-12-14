import { Document } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser {
  email: string;
  cognitoId: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
}

export interface UserCreateInput {
  email: string;
  cognitoId: string;
  role?: string;
}

export interface IUserDocument extends IUser, Document {
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
