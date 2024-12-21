import mongoose, { Schema } from "mongoose";
import { IProductDocument } from "../types/product.types";

const productSchema = new Schema<IProductDocument>(
  {
    name: { type: String, unique: true },
    description: { type: String },
    price: { type: Number },
    cuisines: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category"
      }
    ],
    dietaries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Dietary"
      }
    ],
    inStock: { type: Boolean },
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fats: { type: Number },
    ingredients: [{ type: String }]
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

export const Product = mongoose.model<IProductDocument>(
  "Product",
  productSchema
);
