import mongoose, { Schema } from "mongoose";
import { IProductDocument } from "../types/product.types";

const productSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    inStock: { type: Boolean, default: true }
  },
  {
    timestamps: true,
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
