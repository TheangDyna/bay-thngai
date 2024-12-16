import mongoose, { Schema } from "mongoose";
import { IUserDocument } from "../types/user.types";

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    cognitoId: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true }
  },
  {
    timestamps: true,
    toObject: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      }
    },
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

userSchema.index({ email: 1 });
userSchema.index({ cognitoId: 1 });

export const User = mongoose.model<IUserDocument>("User", userSchema);
