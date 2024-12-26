import mongoose, { Schema } from "mongoose";
import { IUserDocument } from "../types/user.types";
import { defaultSchemaOptions } from "../utils/schemaOptions";

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String },
    cognitoId: { type: String, unique: true },
    role: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    age: { type: Number },
    gender: { type: String },
    height: { type: Number },
    weight: { type: Number },
    activityLevel: { type: String },
    dietaryPreferences: [{ type: String }],
    healthGoals: { type: String },
    allergies: [{ type: String }],
    dailyCalorieTarget: { type: Number }
  },
  defaultSchemaOptions
);

userSchema.index({ email: 1 });
userSchema.index({ cognitoId: 1 });

export const User = mongoose.model<IUserDocument>("User", userSchema);
