import mongoose, { Schema } from "mongoose";
import { ICuisineDocument } from "../types/cuisine.types";

const cuisineSchema = new Schema<ICuisineDocument>(
  {
    name: { type: String, unique: true },
    description: { type: String }
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

export const Cuisine = mongoose.model<ICuisineDocument>(
  "Cuisine",
  cuisineSchema
);
