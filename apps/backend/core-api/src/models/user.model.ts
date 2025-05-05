import mongoose, { Schema } from "mongoose";
import { IUserDocument } from "../types/user.types";
import { defaultSchemaOptions } from "../utils/schemaOptions";

const CartItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1, min: 1 }
  },
  { _id: false }
);

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
    dailyCalorieTarget: { type: Number },
    cart: [CartItemSchema]
  },
  defaultSchemaOptions
);

userSchema.pre(
  /^find/,
  function (this: mongoose.Query<any, IUserDocument>, next) {
    this.populate({ path: "cart.product", select: "name price thumbnail" });
    next();
  }
);

export const User = mongoose.model<IUserDocument>("User", userSchema);
