import mongoose, { Schema } from "mongoose";
import { IAddress, IContact, IUserDocument } from "../types/user.types";
import { defaultSchemaOptions } from "../utils/schemaOptions";

const addressSchema = new Schema<IAddress>(
  {
    label: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true
      },
      address: {
        type: String,
        trim: true
      }
    }
  },
  { _id: true, timestamps: false }
);
addressSchema.index({ location: "2dsphere" });

const contactSchema = new Schema<IContact>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  { _id: true }
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
    addresses: {
      type: [addressSchema],
      default: []
    },
    contacts: {
      type: [contactSchema],
      default: []
    }
  },
  defaultSchemaOptions
);

export const User = mongoose.model<IUserDocument>("User", userSchema);
